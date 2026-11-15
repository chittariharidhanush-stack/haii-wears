import { CacheStorageAdapter } from "./CacheStorageAdapter";
import { IndexedDBStorage } from "./IndexedDBStorage";
import { ASSET_MANIFEST } from "./AssetManifest";

const MAX_GARMENT_CACHE_BUDGET_BYTES = 100 * 1024 * 1024; // 100 MB budget for optional garment assets

export class CacheCleanupService {
  private static activeLocks: Set<string> = new Set();

  static lockAsset(assetId: string): void {
    this.activeLocks.add(assetId);
  }

  static unlockAsset(assetId: string): void {
    this.activeLocks.delete(assetId);
  }

  static isLocked(assetId: string): boolean {
    return this.activeLocks.has(assetId);
  }

  static async runLruCleanupIfNeeded(): Promise<{ evictedCount: number; freedBytes: number }> {
    let evictedCount = 0;
    let freedBytes = 0;

    try {
      const allMetadata = await IndexedDBStorage.getAllAssetMetadata();
      const garmentEntries = allMetadata.filter(
        (m) => m.cacheGroup === "haii-3d-garments-v1" && !m.isEssential
      );

      const totalGarmentBytes = garmentEntries.reduce((sum, m) => sum + m.size, 0);

      // Check if we exceed our configured budget or browser storage threshold
      const { percentUsed } = await CacheStorageAdapter.estimateStorage();
      const needsEviction = totalGarmentBytes > MAX_GARMENT_CACHE_BUDGET_BYTES || percentUsed > 80;

      if (!needsEviction) {
        return { evictedCount: 0, freedBytes: 0 };
      }

      console.log(`[CacheCleanupService] Running LRU cleanup. Total garment bytes: ${(totalGarmentBytes / (1024 * 1024)).toFixed(1)}MB`);

      // Sort by least recently used (ascending timestamp)
      garmentEntries.sort((a, b) => a.lastUsed - b.lastUsed);

      for (const entry of garmentEntries) {
        // Never evict currently active/locked garments in viewport
        if (this.isLocked(entry.id)) {
          continue;
        }

        const manifestEntry = ASSET_MANIFEST[entry.id];
        if (manifestEntry) {
          await CacheStorageAdapter.delete(manifestEntry.url, manifestEntry.cacheGroup);
          await IndexedDBStorage.deleteAssetMetadata(entry.id);
          evictedCount++;
          freedBytes += entry.size;
          console.log(`[CacheCleanupService] Evicted LRU asset: ${entry.id} (${(entry.size / 1024).toFixed(1)} KB)`);

          // Stop once we have cleared below 70% of budget
          const remainingBytes = totalGarmentBytes - freedBytes;
          if (remainingBytes < MAX_GARMENT_CACHE_BUDGET_BYTES * 0.7) {
            break;
          }
        }
      }
    } catch (err) {
      console.warn("[CacheCleanupService] Cleanup error:", err);
    }

    return { evictedCount, freedBytes };
  }
}

