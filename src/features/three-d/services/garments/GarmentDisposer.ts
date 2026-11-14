import * as THREE from "three";

export class GarmentDisposer {
  /**
   * Safely disposes a Three.js Object3D hierarchy and frees all GPU buffers.
   */
  static disposeObject(object: THREE.Object3D): void {
    object.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;

        // 1. Dispose Geometry
        if (mesh.geometry) {
          mesh.geometry.dispose();
        }

        // 2. Dispose Materials and Textures
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => this.disposeMaterial(mat));
          } else {
            this.disposeMaterial(mesh.material);
          }
        }
      }
    });

    if (object.parent) {
      object.parent.remove(object);
    }
  }

  private static disposeMaterial(material: THREE.Material): void {
    // Dispose all associated textures
    const mat = material as any;
    const textureKeys = [
      "map",
      "normalMap",
      "roughnessMap",
      "metalnessMap",
      "aoMap",
      "displacementMap",
      "emissiveMap"
    ];

    textureKeys.forEach((key) => {
      if (mat[key] && mat[key].isTexture) {
        mat[key].dispose();
      }
    });

    material.dispose();
  }
}
