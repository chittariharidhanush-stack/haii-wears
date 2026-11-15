import * as THREE from "three";

export type LightingPreset = "afterhours" | "daylight" | "cyber";

export class LightingManager {
  private scene: THREE.Scene;
  private ambientLight: THREE.AmbientLight;
  private keyLight: THREE.DirectionalLight;
  private fillLight: THREE.DirectionalLight;
  private rimLight: THREE.PointLight;

  constructor(scene: THREE.Scene) {
    this.scene = scene;

    this.ambientLight = new THREE.AmbientLight(0x222222, 1.5);
    scene.add(this.ambientLight);

    this.keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    this.keyLight.position.set(2.5, 4, 3);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 1024;
    this.keyLight.shadow.mapSize.height = 1024;
    this.keyLight.shadow.bias = -0.001;
    scene.add(this.keyLight);

    this.rimLight = new THREE.PointLight(0xf2342b, 6.0, 10);
    this.rimLight.position.set(-2, 2.5, -2);
    scene.add(this.rimLight);

    this.fillLight = new THREE.DirectionalLight(0xa5c4e8, 1.0);
    this.fillLight.position.set(-3, 2, 2);
    scene.add(this.fillLight);

    this.setPreset("afterhours");
  }

  setPreset(preset: LightingPreset): void {
    if (preset === "afterhours") {
      this.keyLight.color.set(0xffffff);
      this.keyLight.intensity = 3.0;
      this.rimLight.color.set(0xf2342b);
      this.rimLight.intensity = 6.0;
      this.fillLight.color.set(0x8a9ba8);
      this.ambientLight.color.set(0x222222);
    } else if (preset === "daylight") {
      this.keyLight.color.set(0xfff8f0);
      this.keyLight.intensity = 3.8;
      this.rimLight.color.set(0xffffff);
      this.rimLight.intensity = 2.0;
      this.fillLight.color.set(0xd0e0f0);
      this.ambientLight.color.set(0x444444);
    } else if (preset === "cyber") {
      this.keyLight.color.set(0x00f0ff);
      this.keyLight.intensity = 3.0;
      this.rimLight.color.set(0xff0055);
      this.rimLight.intensity = 8.0;
      this.fillLight.color.set(0x200050);
      this.ambientLight.color.set(0x101525);
    }
  }
}

