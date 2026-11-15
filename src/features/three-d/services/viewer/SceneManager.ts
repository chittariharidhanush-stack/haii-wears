import * as THREE from "three";

export class SceneManager {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  container: HTMLElement;
  private isVisible = true;
  private renderRequested = false;

  constructor(container: HTMLElement) {
    this.container = container;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Scene with atmospheric fog
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x080808);
    this.scene.fog = new THREE.FogExp2(0x080808, 0.12);

    // 2. High-performance PBR renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true
    });
    this.renderer.setSize(width, height);

    // Mobile / Low-memory adaptive DPR: limit to 1.5 on low memory devices
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2.0);
    this.renderer.setPixelRatio(dpr);

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    container.innerHTML = "";
    container.appendChild(this.renderer.domElement);

    // 3. Ground Plane & Contact Shadow
    this.setupEnvironment();

    // 4. Page visibility listener to pause rendering when tab is hidden
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", () => {
        this.isVisible = document.visibilityState === "visible";
      });
    }
  }

  private setupEnvironment(): void {
    // Ground floor
    const floorGeo = new THREE.PlaneGeometry(12, 12);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      roughness: 0.85,
      metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Reflective grid
    const grid = new THREE.GridHelper(10, 30, 0x222222, 0x111111);
    grid.position.y = 0.005;
    this.scene.add(grid);

    // Ambient contact shadow beneath feet
    const shadowGeo = new THREE.CircleGeometry(0.75, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.65
    });
    const shadowCircle = new THREE.Mesh(shadowGeo, shadowMat);
    shadowCircle.rotation.x = -Math.PI / 2;
    shadowCircle.position.y = 0.01;
    this.scene.add(shadowCircle);
  }

  handleResize(): void {
    if (!this.container || !this.renderer) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.renderer.setSize(w, h);
  }

  canRender(): boolean {
    return this.isVisible;
  }

  dispose(): void {
    this.renderer.dispose();
    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}

