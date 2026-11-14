export class CacheStorageAdapter {
  private static isAvailable(): boolean {
    return typeof window !== "undefined" && "caches" in window;
  }

  static async has(url: string, cacheGroup: string): Promise<boolean> {
    if (!this.isAvailable()) return false;
    try {
      const cache = await caches.open(cacheGroup);
      const match = await cache.match(url);
      return !!match;
    } catch (err) {
      console.warn(`[CacheStorageAdapter] has() failed for ${url}:`, err);
      return false;
    }
  }

  static async get(url: string, cacheGroup: string): Promise<Response | null> {
    if (!this.isAvailable()) return null;
    try {
      const cache = await caches.open(cacheGroup);
      const response = await cache.match(url);
      return response || null;
    } catch (err) {
      console.warn(`[CacheStorageAdapter] get() failed for ${url}:`, err);
      return null;
    }
  }

  static async getBlob(url: string, cacheGroup: string): Promise<Blob | null> {
    const res = await this.get(url, cacheGroup);
    if (!res) return null;
    try {
      return await res.blob();
    } catch (err) {
      console.warn(`[CacheStorageAdapter] getBlob() error for ${url}:`, err);
      return null;
    }
  }

  static async getArrayBuffer(url: string, cacheGroup: string): Promise<ArrayBuffer | null> {
    const res = await this.get(url, cacheGroup);
    if (!res) return null;
    try {
      return await res.arrayBuffer();
    } catch (err) {
      console.warn(`[CacheStorageAdapter] getArrayBuffer() error for ${url}:`, err);
      return null;
    }
  }

  static async put(url: string, response: Response, cacheGroup: string): Promise<void> {
    if (!this.isAvailable()) return;
    try {
      const cache = await caches.open(cacheGroup);
      await cache.put(url, response.clone());
    } catch (err) {
      console.warn(`[CacheStorageAdapter] put() failed for ${url}:`, err);
    }
  }

  static async delete(url: string, cacheGroup: string): Promise<boolean> {
    if (!this.isAvailable()) return false;
    try {
      const cache = await caches.open(cacheGroup);
      return await cache.delete(url);
    } catch (err) {
      console.warn(`[CacheStorageAdapter] delete() failed for ${url}:`, err);
      return false;
    }
  }

  static async clearGroup(cacheGroup: string): Promise<boolean> {
    if (!this.isAvailable()) return false;
    try {
      return await caches.delete(cacheGroup);
    } catch (err) {
      console.warn(`[CacheStorageAdapter] clearGroup() failed for ${cacheGroup}:`, err);
      return false;
    }
  }

  static async estimateStorage(): Promise<{
    usage: number;
    quota: number;
    percentUsed: number;
    persistGranted: boolean;
  }> {
    if (typeof window === "undefined" || !navigator.storage || !navigator.storage.estimate) {
      return { usage: 0, quota: 0, percentUsed: 0, persistGranted: false };
    }

    try {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;
      const quota = estimate.quota || 0;
      const percentUsed = quota > 0 ? (usage / quota) * 100 : 0;

      let persistGranted = false;
      if (navigator.storage.persisted) {
        persistGranted = await navigator.storage.persisted();
        if (!persistGranted && navigator.storage.persist) {
          try {
            persistGranted = await navigator.storage.persist();
          } catch {
            // ignore
          }
        }
      }

      return { usage, quota, percentUsed, persistGranted };
    } catch (err) {
      console.warn("[CacheStorageAdapter] estimateStorage error:", err);
      return { usage: 0, quota: 0, percentUsed: 0, persistGranted: false };
    }
  }
}
