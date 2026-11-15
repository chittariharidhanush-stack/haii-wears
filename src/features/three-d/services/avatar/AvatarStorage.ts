import { AvatarConfig } from "../../types/AvatarTypes";
import { IndexedDBStorage } from "../asset-manager/IndexedDBStorage";

export class AvatarStorage {
  static async saveAvatar(avatar: AvatarConfig): Promise<void> {
    await IndexedDBStorage.saveAvatar(avatar);
  }

  static async loadSavedAvatar(): Promise<AvatarConfig | null> {
    return await IndexedDBStorage.getLatestAvatar();
  }

  static async clearSavedAvatar(id: string): Promise<void> {
    await IndexedDBStorage.deleteAvatar(id);
  }
}

