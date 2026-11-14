import { ASSET_MANIFEST, getStageAssets, getGarmentAsset } from "./AssetManifest";
import { CacheStorageAdapter } from "./CacheStorageAdapter";
import { IndexedDBStorage } from "./IndexedDBStorage";
import { CacheCleanupService } from "./CacheCleanupService";
import { AssetManifestEntry, DownloadProgress } from "../../types/AssetTypes";

type ProgressListener = (progress: DownloadProgress) => void;

export class AssetManager {
  private static inFlightRequests: Map<string, Promise<string>> = new Map();
  private static progressListeners: Set<ProgressListener> = new Set();
  private static stage1Started = false;
  private static stage1Complete = false;
  private static stage2Started = false;
  private static stage2Complete = false;
  private static currentProgress: DownloadProgress = {
    totalFiles: 0,
    completedFiles: 0,
    totalBytes: 0,
    loadedBytes: 0,
    phase: "idle"
  };

  // --- PROGRESS REPORTING ---
  static subscribeProgress(listener: ProgressListener): () => void {
    this.progressListeners.add(listener);
    listener(this.currentProgress);
    return () => {
      this.progressListeners.delete(listener);
    };
  }

  private static updateProgress(patch: Partial<DownloadProgress>): void {
    this.currentProgress = { ...this.currentProgress, ...patch };
    this.progressListeners.forEach((fn) => {
      try {
        fn(this.currentProgress);
      } catch (e) {
        console.error(e);
      }
    });
  }

  // --- NETWORK CONDITION CHECKS ---
  private static shouldThrottleBackground(): boolean {
    if (typeof window === "undefined" || !("connection" in navigator)) return false;
    const conn = (navigator as any).connection;
    if (conn) {
      if (conn.saveData) return true;
      if (conn.effectiveType === "slow-2g" || conn.effectiveType === "2g") return true;
    }
    return false;
  }

  // --- STAGE 1: BACKGROUND PROGRESSIVE DOWNLOAD ---
  static async startStage1Background(): Promise<void> {
    if (this.stage1Started || this.stage1Complete) return;
    if (typeof window === "undefined") return;

    // Check if network is offline or save-data is on
    if (!navigator.onLine || this.shouldThrottleBackground()) {
      console.log("[AssetManager] Stage 1 background download deferred due to network/save-data.");
      return;
    }

    this.stage1Started = true;
    this.updateProgress({ phase: "stage1-background" });
    console.log("[AssetManager] Starting Stage 1 background download of shared 3D runtime...");

    const stage1Assets = getStageAssets("stage1");
    let completed = 0;
    let totalBytes = stage1Assets.reduce((sum, a) => sum + a.expectedBytes, 0);

    this.updateProgress({
      totalFiles: stage1Assets.length,
      completedFiles: 0,
      totalBytes,
      loadedBytes: 0
    });

    for (const asset of stage1Assets) {
      // If Stage 2 was triggered in the meantime, pause Stage 1 to yield bandwidth
      if (this.stage2Started && !this.stage2Complete) {
        console.log("[AssetManager] Pausing Stage 1 background download to prioritize Stage 2.");
        break;
      }

      try {
        this.updateProgress({ activeFile: asset.id });
        await this.loadAsset(asset);
        completed++;
        this.updateProgress({
          completedFiles: completed,
          loadedBytes: this.currentProgress.loadedBytes + asset.expectedBytes
        });
      } catch (err) {
        console.warn(`[AssetManager] Stage 1 download error for ${asset.id}:`, err);
      }
    }

    this.stage1Complete = completed === stage1Assets.length;
    this.updateProgress({
      phase: this.stage1Complete ? "ready" : "idle",
      activeFile: undefined
    });
    console.log(`[AssetManager] Stage 1 background download finished. Completed: ${completed}/${stage1Assets.length}`);
  }

  // --- STAGE 2: HIGH-PRIORITY DOWNLOAD ON 3D LIVE CLICK ---
  static async startStage2Priority(): Promise<void> {
    if (this.stage2Complete) return;
    this.stage2Started = true;

    this.updateProgress({ phase: "stage2-priority" });
    console.log("[AssetManager] Stage 2 high-priority assets requested. Verifying cache & downloading...");

    const stage2Assets = getStageAssets("stage2");
    // Also include any essential Stage 1 assets that were not finished
    const stage1Assets = getStageAssets("stage1");
    const requiredAssets = [...stage1Assets, ...stage2Assets];

    let completed = 0;
    const totalBytes = requiredAssets.reduce((sum, a) => sum + a.expectedBytes, 0);

    this.updateProgress({
      totalFiles: requiredAssets.length,
      completedFiles: 0,
      totalBytes,
      loadedBytes: 0
    });

    for (const asset of requiredAssets) {
      try {
        this.updateProgress({ activeFile: asset.id });
        await this.loadAsset(asset, 3); // 3 retries for high-priority assets
        completed++;
        this.updateProgress({
          completedFiles: completed,
          loadedBytes: this.currentProgress.loadedBytes + asset.expectedBytes
        });
      } catch (err) {
        console.error(`[AssetManager] Stage 2 asset failed: ${asset.id}`, err);
        this.updateProgress({ error: `Failed to load 3D AI asset: ${asset.id}` });
        throw err;
      }
    }

    this.stage2Complete = true;
    this.stage1Complete = true;
    this.updateProgress({ phase: "ready", activeFile: undefined });
    console.log("[AssetManager] Stage 2 download complete! 3D AI & Avatar Engine ready.");
  }

  // --- JIT GARMENT DOWNLOAD ---
  static async loadGarmentModel(productId: string, size: string): Promise<string> {
    const asset = getGarmentAsset(productId, size);
    if (!asset) {
      throw new Error(`Garment model not found in manifest for product ${productId} size ${size}`);
    }

    // Run LRU cleanup if storage is constrained before downloading new garment
    await CacheCleanupService.runLruCleanupIfNeeded();

    CacheCleanupService.lockAsset(asset.id);
    this.updateProgress({ phase: "garment-download", activeFile: asset.id });

    try {
      const url = await this.loadAsset(asset);
      await IndexedDBStorage.touchAsset(asset.id);
      this.updateProgress({ phase: "ready", activeFile: undefined });
      return url;
    } catch (err) {
      CacheCleanupService.unlockAsset(asset.id);
      throw err;
    }
  }

  // --- CENTRAL ASSET LOADER (Cache-First + Deduplication + Exponential Backoff) ---
  static async loadAsset(asset: AssetManifestEntry, maxRetries = 2): Promise<string> {
    // 1. Check if request is already in-flight (deduplication)
    if (this.inFlightRequests.has(asset.id)) {
      return this.inFlightRequests.get(asset.id)!;
    }

    const task = (async () => {
      // 2. Check Cache Storage first
      const isCached = await CacheStorageAdapter.has(asset.url, asset.cacheGroup);
      if (isCached) {
        // Cached hit! Return URL directly
        await IndexedDBStorage.touchAsset(asset.id);
        return asset.url;
      }

      // 3. Not in cache -> Download with exponential backoff
      let attempt = 0;
      let lastError: any = null;

      while (attempt <= maxRetries) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

          const response = await fetch(asset.url, {
            signal: controller.signal,
            cache: "no-cache" // We manage our own Cache Storage
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`HTTP ${response.status} loading ${asset.url}`);
          }

          // 4. Save into Cache Storage
          await CacheStorageAdapter.put(asset.url, response, asset.cacheGroup);

          // 5. Save metadata into IndexedDB
          await IndexedDBStorage.saveAssetMetadata({
            id: asset.id,
            version: asset.version,
            size: asset.expectedBytes,
            lastUsed: Date.now(),
            cacheGroup: asset.cacheGroup,
            isEssential: asset.required,
            usageCount: 1
          });

          return asset.url;
        } catch (err: any) {
          lastError = err;
          attempt++;
          if (attempt <= maxRetries) {
            const delay = Math.pow(2, attempt) * 500; // 1s, 2s, 4s
            console.warn(`[AssetManager] Retry ${attempt}/${maxRetries} for ${asset.id} in ${delay}ms...`);
            await new Promise((r) => setTimeout(r, delay));
          }
        }
      }

      throw lastError || new Error(`Failed to load asset ${asset.id}`);
    })();

    this.inFlightRequests.set(asset.id, task);

    try {
      const result = await task;
      return result;
    } finally {
      this.inFlightRequests.delete(asset.id);
    }
  }

  // --- QUERY CACHE STATUS ---
  static async isAssetCached(assetId: string): Promise<boolean> {
    const entry = ASSET_MANIFEST[assetId];
    if (!entry) return false;
    return await CacheStorageAdapter.has(entry.url, entry.cacheGroup);
  }

  static isStage1Ready(): boolean {
    return this.stage1Complete;
  }

  static isStage2Ready(): boolean {
    return this.stage2Complete;
  }
}
