import fs from "fs";
import path from "path";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

// Polyfill FileReader for Node.js
class NodeFileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(buf => {
      this.result = buf;
      if (this.onload) this.onload({ target: this });
      if (this.onloadend) this.onloadend({ target: this });
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then(buf => {
      this.result = "data:" + (blob.type || "application/octet-stream") + ";base64," + Buffer.from(buf).toString("base64");
      if (this.onload) this.onload({ target: this });
      if (this.onloadend) this.onloadend({ target: this });
    });
  }
}
globalThis.FileReader = NodeFileReader;

async function exportSceneToGlb(scene) {
  const exporter = new GLTFExporter();
  return new Promise((resolve, reject) => {
    exporter.parse(
      scene,
      (glb) => resolve(Buffer.from(glb)),
      (err) => reject(err),
      { binary: true }
    );
  });
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// ---------------------------------------------------------------------
// 1. GENERATE BASE ANATOMICAL HUMAN MESH (human_base.glb & human_base.obj)
// ---------------------------------------------------------------------
async function generateHumanBase() {
  console.log("Generating Base Human Avatar Mesh...");
  const scene = new THREE.Scene();
  scene.name = "HAII_HumanBase_Avatar";

  const skinMat = new THREE.MeshStandardMaterial({
    name: "Avatar_Skin_Material",
    color: 0x181818,
    roughness: 0.65,
    metalness: 0.1
  });

  const root = new THREE.Group();
  root.name = "Avatar_Root";

  // Head
  const headGeo = new THREE.SphereGeometry(0.12, 32, 24);
  headGeo.scale(0.85, 1.15, 1.0);
  const head = new THREE.Mesh(headGeo, skinMat);
  head.name = "Head";
  head.position.set(0, 1.82, 0);
  root.add(head);

  // Neck
  const neckGeo = new THREE.CylinderGeometry(0.055, 0.065, 0.12, 24);
  const neck = new THREE.Mesh(neckGeo, skinMat);
  neck.name = "Neck";
  neck.position.set(0, 1.70, 0);
  root.add(neck);

  // Torso / Chest
  const torsoGeo = new THREE.CylinderGeometry(0.26, 0.18, 0.44, 24);
  torsoGeo.scale(1.0, 1.0, 0.7);
  const torso = new THREE.Mesh(torsoGeo, skinMat);
  torso.name = "Torso";
  torso.position.set(0, 1.45, 0);
  root.add(torso);

  // Pelvis / Hips
  const pelvisGeo = new THREE.CylinderGeometry(0.18, 0.20, 0.22, 24);
  const pelvis = new THREE.Mesh(pelvisGeo, skinMat);
  pelvis.name = "Pelvis";
  pelvis.position.set(0, 1.15, 0);
  root.add(pelvis);

  // Arms
  [-1, 1].forEach((side) => {
    const armGroup = new THREE.Group();
    armGroup.name = side === 1 ? "Arm_Right" : "Arm_Left";
    armGroup.position.set(side * 0.30, 1.62, 0);

    const armGeo = new THREE.CylinderGeometry(0.045, 0.038, 0.58, 16);
    const arm = new THREE.Mesh(armGeo, skinMat);
    arm.position.set(0, -0.29, 0);
    arm.rotation.z = side * 0.08;
    armGroup.add(arm);

    const handGeo = new THREE.BoxGeometry(0.035, 0.08, 0.07);
    const hand = new THREE.Mesh(handGeo, skinMat);
    hand.position.set(side * 0.02, -0.62, 0);
    armGroup.add(hand);

    root.add(armGroup);
  });

  // Legs & Feet
  [-1, 1].forEach((side) => {
    const legGroup = new THREE.Group();
    legGroup.name = side === 1 ? "Leg_Right" : "Leg_Left";
    legGroup.position.set(side * 0.11, 1.05, 0);

    const legGeo = new THREE.CylinderGeometry(0.075, 0.05, 0.98, 20);
    const leg = new THREE.Mesh(legGeo, skinMat);
    leg.position.set(0, -0.49, 0);
    legGroup.add(leg);

    const sneakerGeo = new THREE.BoxGeometry(0.11, 0.09, 0.26);
    const sneakerMat = new THREE.MeshStandardMaterial({
      name: "Sneaker_Mat",
      color: 0x161616,
      roughness: 0.3,
      metalness: 0.2
    });
    const sneaker = new THREE.Mesh(sneakerGeo, sneakerMat);
    sneaker.position.set(0, -1.015, 0.04);
    legGroup.add(sneaker);

    root.add(legGroup);
  });

  scene.add(root);

  // Export GLB
  const outGlbDir = "public/assets/3d/avatar";
  ensureDir(outGlbDir);
  const glbBuffer = await exportSceneToGlb(scene);
  fs.writeFileSync(path.join(outGlbDir, "human_base.glb"), glbBuffer);
  console.log(`Saved ${path.join(outGlbDir, "human_base.glb")} (${glbBuffer.length} bytes)`);

  // Export basic OBJ for WASM parser
  let objStr = "# HAII WEAES Human Base OBJ\n";
  let vOffset = 1;
  root.traverse((child) => {
    if (child.isMesh) {
      const geo = child.geometry.clone();
      geo.applyMatrix4(child.matrixWorld);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        objStr += `v ${pos.getX(i).toFixed(4)} ${pos.getY(i).toFixed(4)} ${pos.getZ(i).toFixed(4)}\n`;
      }
      if (geo.index) {
        const idx = geo.index;
        for (let i = 0; i < idx.count; i += 3) {
          objStr += `f ${idx.getX(i) + vOffset} ${idx.getX(i + 1) + vOffset} ${idx.getX(i + 2) + vOffset}\n`;
        }
        vOffset += pos.count;
      }
    }
  });
  fs.writeFileSync(path.join(outGlbDir, "human_base.obj"), objStr);
  console.log(`Saved ${path.join(outGlbDir, "human_base.obj")} (${objStr.length} chars)`);
}

// ---------------------------------------------------------------------
// 2. GARMENT BUILDERS FOR EACH SILHOUETTE & SIZE VARIANT
// ---------------------------------------------------------------------

// Size multipliers
const SIZE_SCALES = {
  S: { w: 0.94, l: 0.96, d: 0.94 },
  M: { w: 1.0, l: 1.0, d: 1.0 },
  L: { w: 1.08, l: 1.04, d: 1.06 },
  XL: { w: 1.16, l: 1.08, d: 1.12 },
  XXL: { w: 1.24, l: 1.12, d: 1.18 }
};

// Builder: NOCTURN OVERSIZED HEAVYWEIGHT HOODIE
function createHoodieMesh(sizeScale) {
  const group = new THREE.Group();
  group.name = "Nocturn_Hoodie";

  const fabricMat = new THREE.MeshStandardMaterial({
    name: "Terry_Cotton_480GSM",
    color: 0x0c0c0c,
    roughness: 0.88,
    metalness: 0.05
  });

  // Oversized boxy torso
  const torsoWidth = 0.29 * sizeScale.w;
  const torsoHeight = 0.56 * sizeScale.l;
  const torsoDepth = 0.23 * sizeScale.d;
  const torsoGeo = new THREE.CylinderGeometry(torsoWidth, torsoWidth * 0.95, torsoHeight, 28);
  torsoGeo.scale(1.0, 1.0, torsoDepth / torsoWidth);
  const torso = new THREE.Mesh(torsoGeo, fabricMat);
  torso.name = "Hoodie_Body";
  torso.position.set(0, 1.44, 0);
  group.add(torso);

  // Dropped-shoulder sleeves
  [-1, 1].forEach((side) => {
    const sleeveLength = 0.58 * sizeScale.l;
    const sleeveRadius = 0.072 * sizeScale.w;
    const sleeveGeo = new THREE.CylinderGeometry(sleeveRadius, sleeveRadius * 0.72, sleeveLength, 20);
    const sleeve = new THREE.Mesh(sleeveGeo, fabricMat);
    sleeve.name = side === 1 ? "Sleeve_Right" : "Sleeve_Left";
    sleeve.position.set(side * (torsoWidth + 0.035), 1.58 - sleeveLength / 2, 0);
    sleeve.rotation.z = side * 0.12;
    group.add(sleeve);
  });

  // Sculptural Draped Streetwear Hood
  const hoodGeo = new THREE.SphereGeometry(0.19 * sizeScale.w, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.7);
  hoodGeo.scale(0.9, 1.15, 1.1);
  const hood = new THREE.Mesh(hoodGeo, fabricMat);
  hood.name = "Draped_Hood";
  hood.position.set(0, 1.70, -0.06);
  hood.rotation.x = 0.35;
  group.add(hood);

  // Kangaroo Front Pocket
  const pocketGeo = new THREE.BoxGeometry(0.26 * sizeScale.w, 0.18 * sizeScale.l, 0.05);
  const pocket = new THREE.Mesh(pocketGeo, fabricMat);
  pocket.name = "Kangaroo_Pocket";
  pocket.position.set(0, 1.30, torsoDepth * 0.92);
  group.add(pocket);

  return group;
}

// Builder: LONDON AFTER DARK TEE
function createTeeMesh(sizeScale) {
  const group = new THREE.Group();
  group.name = "London_Dark_Tee";

  const fabricMat = new THREE.MeshStandardMaterial({
    name: "Single_Jersey_260GSM",
    color: 0x161616,
    roughness: 0.85,
    metalness: 0.05
  });

  const torsoWidth = 0.28 * sizeScale.w;
  const torsoHeight = 0.54 * sizeScale.l;
  const torsoDepth = 0.20 * sizeScale.d;
  const torsoGeo = new THREE.CylinderGeometry(torsoWidth, torsoWidth, torsoHeight, 28);
  torsoGeo.scale(1.0, 1.0, torsoDepth / torsoWidth);
  const torso = new THREE.Mesh(torsoGeo, fabricMat);
  torso.name = "Tee_Body";
  torso.position.set(0, 1.45, 0);
  group.add(torso);

  // Dropped elbow-length sleeves
  [-1, 1].forEach((side) => {
    const sleeveLength = 0.34 * sizeScale.l;
    const sleeveRadius = 0.07 * sizeScale.w;
    const sleeveGeo = new THREE.CylinderGeometry(sleeveRadius, sleeveRadius * 0.95, sleeveLength, 20);
    const sleeve = new THREE.Mesh(sleeveGeo, fabricMat);
    sleeve.name = side === 1 ? "Tee_Sleeve_Right" : "Tee_Sleeve_Left";
    sleeve.position.set(side * (torsoWidth + 0.03), 1.58 - sleeveLength / 2, 0);
    sleeve.rotation.z = side * 0.14;
    group.add(sleeve);
  });

  // Ribbed collar
  const collarGeo = new THREE.TorusGeometry(0.09, 0.015, 12, 32);
  const collar = new THREE.Mesh(collarGeo, fabricMat);
  collar.name = "Crew_Collar";
  collar.position.set(0, 1.71, 0);
  collar.rotation.x = Math.PI / 2;
  group.add(collar);

  return group;
}

// Builder: ARCHIVE TACTICAL CARGO TROUSERS
function createCargoMesh(sizeScale) {
  const group = new THREE.Group();
  group.name = "Tactical_Cargo_Trousers";

  const ripstopMat = new THREE.MeshStandardMaterial({
    name: "Tactical_Ripstop",
    color: 0x121212,
    roughness: 0.8,
    metalness: 0.1
  });

  // Waistband & Hips
  const hipWidth = 0.23 * sizeScale.w;
  const waistGeo = new THREE.CylinderGeometry(hipWidth * 0.92, hipWidth, 0.22 * sizeScale.l, 24);
  const waist = new THREE.Mesh(waistGeo, ripstopMat);
  waist.name = "Cargo_Waist";
  waist.position.set(0, 1.15, 0);
  group.add(waist);

  // Legs with 3D Pleated Pockets
  [-1, 1].forEach((side) => {
    const legLength = 0.96 * sizeScale.l;
    const legRadius = 0.095 * sizeScale.w;
    const legGeo = new THREE.CylinderGeometry(legRadius, legRadius * 0.78, legLength, 20);
    const leg = new THREE.Mesh(legGeo, ripstopMat);
    leg.name = side === 1 ? "Cargo_Leg_Right" : "Cargo_Leg_Left";
    leg.position.set(side * 0.115, 1.04 - legLength / 2, 0);
    group.add(leg);

    // 3D Accordion Utility Pocket on outer thigh
    const pocketGeo = new THREE.BoxGeometry(0.06, 0.16 * sizeScale.l, 0.14);
    const pocket = new THREE.Mesh(pocketGeo, ripstopMat);
    pocket.name = side === 1 ? "Pocket_Right" : "Pocket_Left";
    pocket.position.set(side * (0.115 + legRadius * 0.85), 0.78, 0);
    group.add(pocket);
  });

  return group;
}

// Builder: APOCALYPSE REVERSIBLE BOMBER JACKET
function createBomberMesh(sizeScale) {
  const group = new THREE.Group();
  group.name = "Apocalypse_Bomber_Jacket";

  const nylonMat = new THREE.MeshStandardMaterial({
    name: "Flight_Nylon_Heavy",
    color: 0x111111,
    roughness: 0.35,
    metalness: 0.25
  });

  // Puffy quilted torso
  const torsoWidth = 0.31 * sizeScale.w;
  const torsoHeight = 0.52 * sizeScale.l;
  const torsoGeo = new THREE.CylinderGeometry(torsoWidth, torsoWidth * 0.88, torsoHeight, 28);
  torsoGeo.scale(1.0, 1.0, 0.78);
  const torso = new THREE.Mesh(torsoGeo, nylonMat);
  torso.name = "Bomber_Torso";
  torso.position.set(0, 1.45, 0);
  group.add(torso);

  // Puffy gathered sleeves
  [-1, 1].forEach((side) => {
    const sleeveLength = 0.58 * sizeScale.l;
    const sleeveRadius = 0.085 * sizeScale.w;
    const sleeveGeo = new THREE.CylinderGeometry(sleeveRadius, sleeveRadius * 0.65, sleeveLength, 20);
    const sleeve = new THREE.Mesh(sleeveGeo, nylonMat);
    sleeve.name = side === 1 ? "Bomber_Sleeve_Right" : "Bomber_Sleeve_Left";
    sleeve.position.set(side * (torsoWidth + 0.04), 1.58 - sleeveLength / 2, 0);
    sleeve.rotation.z = side * 0.12;
    group.add(sleeve);
  });

  return group;
}

// Builder: RAW SELVEDGE DENIM
function createDenimMesh(sizeScale) {
  const group = new THREE.Group();
  group.name = "Raw_Selvedge_Denim";

  const denimMat = new THREE.MeshStandardMaterial({
    name: "Selvedge_Denim_14oz",
    color: 0x141822, // Deep indigo raw cast
    roughness: 0.82,
    metalness: 0.08
  });

  const hipWidth = 0.22 * sizeScale.w;
  const waistGeo = new THREE.CylinderGeometry(hipWidth * 0.94, hipWidth, 0.22 * sizeScale.l, 24);
  const waist = new THREE.Mesh(waistGeo, denimMat);
  waist.name = "Denim_Waist";
  waist.position.set(0, 1.15, 0);
  group.add(waist);

  [-1, 1].forEach((side) => {
    const legLength = 0.96 * sizeScale.l;
    const legRadius = 0.088 * sizeScale.w;
    const legGeo = new THREE.CylinderGeometry(legRadius, legRadius * 0.82, legLength, 20);
    const leg = new THREE.Mesh(legGeo, denimMat);
    leg.name = side === 1 ? "Denim_Leg_Right" : "Denim_Leg_Left";
    leg.position.set(side * 0.11, 1.04 - legLength / 2, 0);
    group.add(leg);
  });

  return group;
}

// Builder: MONOLITH BOXY FLANNEL SHIRT
function createFlannelMesh(sizeScale) {
  const group = new THREE.Group();
  group.name = "Monolith_Boxy_Flannel";

  const flannelMat = new THREE.MeshStandardMaterial({
    name: "Brushed_Cotton_Flannel",
    color: 0x221a16, // Dark espresso / charcoal
    roughness: 0.9,
    metalness: 0.02
  });

  const torsoWidth = 0.28 * sizeScale.w;
  const torsoHeight = 0.55 * sizeScale.l;
  const torsoGeo = new THREE.CylinderGeometry(torsoWidth, torsoWidth * 0.98, torsoHeight, 28);
  torsoGeo.scale(1.0, 1.0, 0.72);
  const torso = new THREE.Mesh(torsoGeo, flannelMat);
  torso.name = "Flannel_Body";
  torso.position.set(0, 1.45, 0);
  group.add(torso);

  // Chest pockets
  [-1, 1].forEach((side) => {
    const pocketGeo = new THREE.BoxGeometry(0.09 * sizeScale.w, 0.11 * sizeScale.l, 0.02);
    const pocket = new THREE.Mesh(pocketGeo, flannelMat);
    pocket.name = side === 1 ? "Flannel_Pocket_Right" : "Flannel_Pocket_Left";
    pocket.position.set(side * 0.11, 1.50, 0.15 * sizeScale.d);
    group.add(pocket);
  });

  // Sleeves
  [-1, 1].forEach((side) => {
    const sleeveLength = 0.58 * sizeScale.l;
    const sleeveRadius = 0.068 * sizeScale.w;
    const sleeveGeo = new THREE.CylinderGeometry(sleeveRadius, sleeveRadius * 0.72, sleeveLength, 20);
    const sleeve = new THREE.Mesh(sleeveGeo, flannelMat);
    sleeve.name = side === 1 ? "Flannel_Sleeve_Right" : "Flannel_Sleeve_Left";
    sleeve.position.set(side * (torsoWidth + 0.03), 1.58 - sleeveLength / 2, 0);
    sleeve.rotation.z = side * 0.12;
    group.add(sleeve);
  });

  return group;
}

// Builder: TECHNICAL CROSSBODY MODULAR BAG
function createBagMesh() {
  const group = new THREE.Group();
  group.name = "Crossbody_Bag";

  const corduraMat = new THREE.MeshStandardMaterial({
    name: "Cordura_500D_Nylon",
    color: 0x0a0a0a,
    roughness: 0.75,
    metalness: 0.2
  });

  const buckleMat = new THREE.MeshStandardMaterial({
    name: "Cobra_Buckle_Aluminum",
    color: 0x333333,
    roughness: 0.2,
    metalness: 0.9
  });

  // Main bag pouch
  const pouchGeo = new THREE.BoxGeometry(0.24, 0.15, 0.09);
  const pouch = new THREE.Mesh(pouchGeo, corduraMat);
  pouch.name = "Sling_Pouch";
  pouch.position.set(0.12, 1.25, 0.16);
  pouch.rotation.z = -0.15;
  group.add(pouch);

  // Webbing Strap
  const strapGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.85, 16);
  const strap = new THREE.Mesh(strapGeo, corduraMat);
  strap.name = "Webbing_Strap";
  strap.position.set(0.02, 1.48, 0.10);
  strap.rotation.z = -0.75;
  group.add(strap);

  // Metal Buckle
  const buckleGeo = new THREE.BoxGeometry(0.05, 0.04, 0.025);
  const buckle = new THREE.Mesh(buckleGeo, buckleMat);
  buckle.name = "Quick_Release_Buckle";
  buckle.position.set(0.0, 1.50, 0.14);
  group.add(buckle);

  return group;
}

// Builder: STATEMENT CHUNKY SILVER CHAIN
function createChainMesh() {
  const group = new THREE.Group();
  group.name = "Cuban_Link_Chain";

  const silverMat = new THREE.MeshStandardMaterial({
    name: "Polished_925_Silver",
    color: 0xd8d8d8,
    roughness: 0.15,
    metalness: 0.95
  });

  const chainGeo = new THREE.TorusGeometry(0.12, 0.012, 16, 40, Math.PI * 1.5);
  const chain = new THREE.Mesh(chainGeo, silverMat);
  chain.name = "Silver_Links";
  chain.position.set(0, 1.66, 0.04);
  chain.rotation.x = Math.PI / 2.3;
  group.add(chain);

  return group;
}

// Builder: CARPENTER SHORTS
function createShortsMesh(sizeScale) {
  const group = new THREE.Group();
  group.name = "Carpenter_Shorts";

  const canvasMat = new THREE.MeshStandardMaterial({
    name: "Duck_Canvas_12oz",
    color: 0x1a1a1a,
    roughness: 0.85,
    metalness: 0.05
  });

  const hipWidth = 0.23 * sizeScale.w;
  const waistGeo = new THREE.CylinderGeometry(hipWidth * 0.94, hipWidth, 0.22 * sizeScale.l, 24);
  const waist = new THREE.Mesh(waistGeo, canvasMat);
  waist.name = "Shorts_Waist";
  waist.position.set(0, 1.15, 0);
  group.add(waist);

  [-1, 1].forEach((side) => {
    const legLength = 0.46 * sizeScale.l;
    const legRadius = 0.105 * sizeScale.w;
    const legGeo = new THREE.CylinderGeometry(legRadius, legRadius * 0.92, legLength, 20);
    const leg = new THREE.Mesh(legGeo, canvasMat);
    leg.name = side === 1 ? "Shorts_Leg_Right" : "Shorts_Leg_Left";
    leg.position.set(side * 0.115, 1.04 - legLength / 2, 0);
    group.add(leg);
  });

  return group;
}

// ---------------------------------------------------------------------
// 3. MAIN RUNNER: EXPORT ALL GARMENTS & SIZES TO BINARY GLB
// ---------------------------------------------------------------------
async function run() {
  await generateHumanBase();

  const garmentsToExport = [
    { id: "prod_01", slug: "nocturn-hoodie", sizes: ["S", "M", "L", "XL", "XXL"], builder: createHoodieMesh },
    { id: "prod_02", slug: "london-dark-tee", sizes: ["S", "M", "L", "XL"], builder: createTeeMesh },
    { id: "prod_03", slug: "tactical-cargo", sizes: ["S", "M", "L", "XL"], builder: createCargoMesh },
    { id: "prod_04", slug: "apocalypse-bomber", sizes: ["M", "L", "XL"], builder: createBomberMesh },
    { id: "prod_05", slug: "selvedge-denim", sizes: ["S", "M", "L", "XL"], builder: createDenimMesh },
    { id: "prod_06", slug: "boxy-flannel", sizes: ["S", "M", "L", "XL"], builder: createFlannelMesh },
    { id: "prod_11", slug: "crossbody-bag", sizes: ["ONE_SIZE"], builder: () => createBagMesh() },
    { id: "prod_14", slug: "carpenter-shorts", sizes: ["S", "M", "L", "XL"], builder: createShortsMesh },
    { id: "prod_16", slug: "silver-chain", sizes: ["ONE_SIZE"], builder: () => createChainMesh() }
  ];

  console.log(`\nExporting ${garmentsToExport.length} garments with size variants...`);

  for (const garment of garmentsToExport) {
    for (const size of garment.sizes) {
      const scale = SIZE_SCALES[size] || SIZE_SCALES.M;
      const meshGroup = garment.builder(scale);

      const scene = new THREE.Scene();
      scene.add(meshGroup);

      const outDir = path.join("public/assets/3d/garments", garment.id, size);
      ensureDir(outDir);

      const glbBuffer = await exportSceneToGlb(scene);
      const filePath = path.join(outDir, "model.glb");
      fs.writeFileSync(filePath, glbBuffer);
      console.log(`✓ Exported [${garment.id}] (${garment.slug}) Size ${size} -> ${filePath} (${glbBuffer.length} bytes)`);
    }
  }

  console.log("\nALL 3D ASSETS EXPORTED SUCCESSFULLY!");
}

run().catch((err) => {
  console.error("FATAL ERROR generating 3D assets:", err);
  process.exit(1);
});
