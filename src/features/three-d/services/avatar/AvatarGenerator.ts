import * as THREE from "three";
import { AvatarConfig } from "../../types/AvatarTypes";
import { OxiHumanAdapter } from "./OxiHumanAdapter";

export class AvatarGenerator {
  /**
   * Generates a fully customized 3D human avatar group conforming to confirmed measurements.
   */
  static async generateAvatarMesh(config: AvatarConfig): Promise<THREE.Group> {
    const avatarRoot = new THREE.Group();
    avatarRoot.name = `Avatar_${config.id}`;
    avatarRoot.userData = { isAvatarBase: true, config };

    // Try OxiHuman WebAssembly engine first
    const wasmReady = await OxiHumanAdapter.initialize();
    if (wasmReady) {
      OxiHumanAdapter.applyMeasurements(config.measurements);
    }

    // Material configuration
    const isChrome = config.skinTone === "chrome";
    const skinMat = new THREE.MeshStandardMaterial({
      name: "Avatar_Skin_Material",
      color: isChrome ? 0xffffff : new THREE.Color(config.skinTone),
      roughness: isChrome ? 0.05 : 0.65,
      metalness: isChrome ? 0.95 : 0.1
    });

    // Anatomical scaling based on confirmed customer measurements:
    // Base reference: 180cm height, 98cm chest, 80cm waist, 98cm hips
    const heightScale = config.measurements.heightCm / 180;
    const chestScale = config.measurements.chestCm / 98;
    const waistScale = config.measurements.waistCm / 80;
    const hipScale = config.measurements.hipCm / 98;

    const buildChestMultiplier =
      config.build === "broad" ? 1.12 : config.build === "athletic" ? 1.06 : config.build === "slim" ? 0.92 : 1.0;
    const buildWaistMultiplier =
      config.build === "broad" ? 1.14 : config.build === "athletic" ? 0.98 : config.build === "slim" ? 0.90 : 1.0;

    const effectiveChestScale = chestScale * buildChestMultiplier;
    const effectiveWaistScale = waistScale * buildWaistMultiplier;
    const effectiveHipScale = hipScale * (config.build === "broad" ? 1.1 : 1.0);

    const mannequinGroup = new THREE.Group();
    mannequinGroup.scale.set(1, heightScale, 1);

    // 1. Head
    const headGeo = new THREE.SphereGeometry(0.12, 32, 24);
    headGeo.scale(0.85, 1.15, 1.0);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.name = "Avatar_Head";
    head.position.set(0, 1.82, 0);
    head.castShadow = true;
    mannequinGroup.add(head);

    // 2. Neck
    const neckGeo = new THREE.CylinderGeometry(0.055, 0.065, 0.12, 24);
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.name = "Avatar_Neck";
    neck.position.set(0, 1.70, 0);
    neck.castShadow = true;
    mannequinGroup.add(neck);

    // 3. Torso / Chest (Directly driven by confirmed chest & waist circumferences)
    const chestWidth = (config.gender === "feminine" ? 0.22 : 0.26) * effectiveChestScale;
    const chestDepth = (config.gender === "feminine" ? 0.16 : 0.18) * effectiveChestScale;
    const waistWidth = 0.18 * effectiveWaistScale;
    const torsoGeo = new THREE.CylinderGeometry(chestWidth, waistWidth, 0.44, 24);
    torsoGeo.scale(1.0, 1.0, chestDepth / chestWidth);
    const torso = new THREE.Mesh(torsoGeo, skinMat);
    torso.name = "Avatar_Torso";
    torso.position.set(0, 1.45, 0);
    torso.castShadow = true;
    mannequinGroup.add(torso);

    // 4. Pelvis / Hips (Driven by confirmed hip circumference)
    const hipWidth = (config.gender === "feminine" ? 0.23 : 0.20) * effectiveHipScale;
    const pelvisGeo = new THREE.CylinderGeometry(waistWidth, hipWidth, 0.22, 24);
    const pelvis = new THREE.Mesh(pelvisGeo, skinMat);
    pelvis.name = "Avatar_Pelvis";
    pelvis.position.set(0, 1.15, 0);
    pelvis.castShadow = true;
    mannequinGroup.add(pelvis);

    // 5. Arms & Hands
    const armRadius = 0.045 * effectiveChestScale;
    const armLength = 0.58;

    [-1, 1].forEach((side) => {
      const armGroup = new THREE.Group();
      armGroup.name = side === 1 ? "Avatar_Arm_Right" : "Avatar_Arm_Left";
      armGroup.position.set(side * (chestWidth + 0.04), 1.62, 0);

      const armGeo = new THREE.CylinderGeometry(armRadius, armRadius * 0.82, armLength, 16);
      const arm = new THREE.Mesh(armGeo, skinMat);
      arm.position.set(0, -armLength / 2, 0);
      arm.rotation.z = side * 0.08;
      arm.castShadow = true;
      armGroup.add(arm);

      const handGeo = new THREE.BoxGeometry(0.035, 0.08, 0.07);
      const hand = new THREE.Mesh(handGeo, skinMat);
      hand.position.set(side * 0.02, -armLength - 0.04, 0);
      armGroup.add(hand);

      mannequinGroup.add(armGroup);
    });

    // 6. Legs & Chunky Streetwear Sneakers
    const legRadius = 0.075 * (config.build === "broad" ? 1.12 : 1.0);
    const legLength = 0.98;

    [-1, 1].forEach((side) => {
      const legGroup = new THREE.Group();
      legGroup.name = side === 1 ? "Avatar_Leg_Right" : "Avatar_Leg_Left";
      legGroup.position.set(side * (hipWidth * 0.55), 1.05, 0);

      const legGeo = new THREE.CylinderGeometry(legRadius, legRadius * 0.65, legLength, 20);
      const leg = new THREE.Mesh(legGeo, skinMat);
      leg.position.set(0, -legLength / 2, 0);
      leg.castShadow = true;
      legGroup.add(leg);

      const sneakerGeo = new THREE.BoxGeometry(0.11, 0.09, 0.26);
      const sneakerMat = new THREE.MeshStandardMaterial({
        name: "Chunky_Sneaker_Mat",
        color: 0x161616,
        roughness: 0.3,
        metalness: 0.2
      });
      const sneaker = new THREE.Mesh(sneakerGeo, sneakerMat);
      sneaker.position.set(0, -legLength - 0.035, 0.04);
      sneaker.castShadow = true;
      legGroup.add(sneaker);

      mannequinGroup.add(legGroup);
    });

    avatarRoot.add(mannequinGroup);
    return avatarRoot;
  }
}
