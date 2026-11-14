import * as THREE from "three";

export type CameraPreset = "full" | "front" | "back" | "side" | "closeup";

export class CameraManager {
  camera: THREE.PerspectiveCamera;
  container: HTMLElement;
  private isDragging = false;
  private previousMousePosition = { x: 0, y: 0 };
  private rotationTarget = { x: 0.1, y: 0 };
  private currentRotation = { x: 0.1, y: 0 };
  private autoRotate = false;

  constructor(container: HTMLElement) {
    this.container = container;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 40° FOV gives natural editorial compression
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.setPreset("full");
    this.attachEventListeners();
  }

  setPreset(preset: CameraPreset): void {
    switch (preset) {
      case "full":
        this.camera.position.set(0, 1.18, 4.3);
        this.rotationTarget = { x: 0.1, y: 0 };
        break;
      case "front":
        this.camera.position.set(0, 1.45, 2.4);
        this.rotationTarget = { x: 0.05, y: 0 };
        break;
      case "back":
        this.camera.position.set(0, 1.45, -2.4);
        this.rotationTarget = { x: 0.05, y: Math.PI };
        break;
      case "side":
        this.camera.position.set(2.4, 1.35, 0);
        this.rotationTarget = { x: 0.05, y: Math.PI / 2 };
        break;
      case "closeup":
        this.camera.position.set(0, 1.42, 1.6);
        this.rotationTarget = { x: 0.0, y: 0 };
        break;
    }
  }

  toggleAutoRotate(enable?: boolean): boolean {
    this.autoRotate = enable !== undefined ? enable : !this.autoRotate;
    return this.autoRotate;
  }

  isAutoRotating(): boolean {
    return this.autoRotate;
  }

  reset(): void {
    this.setPreset("full");
  }

  update(avatarGroup?: THREE.Group | null): void {
    if (this.autoRotate) {
      this.rotationTarget.y += 0.008;
    }

    // Smooth rotation interpolation
    this.currentRotation.y += (this.rotationTarget.y - this.currentRotation.y) * 0.1;
    this.currentRotation.x += (this.rotationTarget.x - this.currentRotation.x) * 0.1;

    if (avatarGroup) {
      avatarGroup.rotation.y = this.currentRotation.y;
    }

    const targetY = 1.18 + this.currentRotation.x * 0.4;
    this.camera.position.y += (targetY - this.camera.position.y) * 0.1;
    this.camera.lookAt(0, 0.98, 0);
  }

  handleResize(): void {
    if (!this.container || !this.camera) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  private attachEventListeners(): void {
    const onMouseDown = (e: MouseEvent) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.rotationTarget.y += deltaX * 0.008;
      this.rotationTarget.x = Math.max(-0.25, Math.min(0.5, this.rotationTarget.x + deltaY * 0.005));

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      this.isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      this.camera.position.z = Math.max(1.3, Math.min(5.5, this.camera.position.z + e.deltaY * 0.003));
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!this.isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
      const deltaY = e.touches[0].clientY - this.previousMousePosition.y;

      this.rotationTarget.y += deltaX * 0.008;
      this.rotationTarget.x = Math.max(-0.25, Math.min(0.5, this.rotationTarget.x + deltaY * 0.005));

      this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      this.isDragging = false;
    };

    this.container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    this.container.addEventListener("wheel", onWheel, { passive: false });
    this.container.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
  }
}
