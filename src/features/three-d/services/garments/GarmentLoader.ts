import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { AssetManager } from "../asset-manager/AssetManager";

export class GarmentLoader {
  private static gltfLoader: GLTFLoader = new GLTFLoader();

  static async loadGarment(
    productId: string,
    size: string
  ): Promise<THREE.Group> {
    // 1. Ensure file is available in Cache Storage via AssetManager
    const assetUrl = await AssetManager.loadGarmentModel(productId, size);

    // 2. Load GLB
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        assetUrl,
        (gltf) => {
          const model = gltf.scene;
          model.name = `Garment_${productId}_${size}`;
          model.userData = { productId, size };

          // Enable shadows and PBR quality on all meshes
          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          resolve(model);
        },
        undefined,
        (error) => {
          console.error(`[GarmentLoader] Failed to load GLB for ${productId} ${size}:`, error);
          reject(error);
        }
      );
    });
  }
}

