import { AvatarConfig } from "../../types/AvatarTypes";
import { CacheMetadata } from "../../types/AssetTypes";

const DB_NAME = "haii-weaes-3d-db";
const DB_VERSION = 1;

export class IndexedDBStorage {
  private static dbPromise: Promise<IDBDatabase> | null = null;

  private static getDB(): Promise<IDBDatabase> {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      return Promise.reject(new Error("IndexedDB is not available"));
    }

    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;

          // Store for personalized user avatars
          if (!db.objectStoreNames.contains("avatars")) {
            const avatarStore = db.createObjectStore("avatars", { keyPath: "id" });
            avatarStore.createIndex("updatedAt", "updatedAt", { unique: false });
          }

          // Store for confirmed body measurements
          if (!db.objectStoreNames.contains("measurements")) {
            db.createObjectStore("measurements", { keyPath: "id" });
          }

          // Store for asset cache metadata and LRU tracking
          if (!db.objectStoreNames.contains("asset_metadata")) {
            const assetStore = db.createObjectStore("asset_metadata", { keyPath: "id" });
            assetStore.createIndex("lastUsed", "lastUsed", { unique: false });
            assetStore.createIndex("cacheGroup", "cacheGroup", { unique: false });
          }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }

    return this.dbPromise;
  }

  // --- AVATAR PERSISTENCE ---
  static async saveAvatar(avatar: AvatarConfig): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction("avatars", "readwrite");
        const store = tx.objectStore("avatars");
        const req = store.put(avatar);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn("[IndexedDBStorage] saveAvatar failed:", err);
    }
  }

  static async getLatestAvatar(): Promise<AvatarConfig | null> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction("avatars", "readonly");
        const store = tx.objectStore("avatars");
        const req = store.getAll();
        req.onsuccess = () => {
          const avatars = (req.result as AvatarConfig[]) || [];
          if (avatars.length === 0) return resolve(null);
          // Return most recently updated avatar
          avatars.sort((a, b) => b.updatedAt - a.updatedAt);
          resolve(avatars[0]);
        };
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn("[IndexedDBStorage] getLatestAvatar failed:", err);
      return null;
    }
  }

  static async deleteAvatar(id: string): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction("avatars", "readwrite");
        const store = tx.objectStore("avatars");
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn("[IndexedDBStorage] deleteAvatar failed:", err);
    }
  }

  // --- ASSET METADATA & LRU TRACKING ---
  static async saveAssetMetadata(meta: CacheMetadata): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction("asset_metadata", "readwrite");
        const store = tx.objectStore("asset_metadata");
        const req = store.put(meta);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn("[IndexedDBStorage] saveAssetMetadata failed:", err);
    }
  }

  static async touchAsset(id: string): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction("asset_metadata", "readwrite");
        const store = tx.objectStore("asset_metadata");
        const getReq = store.get(id);
        getReq.onsuccess = () => {
          const entry = getReq.result as CacheMetadata | undefined;
          if (entry) {
            entry.lastUsed = Date.now();
            entry.usageCount = (entry.usageCount || 0) + 1;
            store.put(entry);
          }
          resolve();
        };
        getReq.onerror = () => reject(getReq.error);
      });
    } catch {
      // silent
    }
  }

  static async getAllAssetMetadata(): Promise<CacheMetadata[]> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction("asset_metadata", "readonly");
        const store = tx.objectStore("asset_metadata");
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn("[IndexedDBStorage] getAllAssetMetadata failed:", err);
      return [];
    }
  }

  static async deleteAssetMetadata(id: string): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction("asset_metadata", "readwrite");
        const store = tx.objectStore("asset_metadata");
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      // silent
    }
  }
}
