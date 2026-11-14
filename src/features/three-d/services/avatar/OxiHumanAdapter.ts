import { ConfirmedMeasurements } from "../../types/AvatarTypes";

export interface OxiHumanMeshOutput {
  positions: Float32Array;
  normals: Float32Array;
  uvs: Float32Array;
  indices: Uint32Array;
  vertexCount: number;
  indexCount: number;
}

export class OxiHumanAdapter {
  private static wasmEngine: any = null;
  private static isInitialized = false;

  static async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;
    if (typeof window === "undefined") return false;

    try {
      console.log("[OxiHumanAdapter] Initializing OxiHuman WebAssembly engine...");
      // In browser, import the OxiHuman WASM module
      const oxihuman = await import("@cooljapan/oxihuman");
      if (oxihuman && (oxihuman as any).OxiHumanEngine) {
        this.wasmEngine = new (oxihuman as any).OxiHumanEngine();
        this.isInitialized = true;
        console.log("[OxiHumanAdapter] OxiHumanEngine successfully initialized in WebAssembly sandbox.");
        return true;
      }
    } catch (err) {
      console.warn("[OxiHumanAdapter] WASM direct engine load error, using high-fidelity parametric adapter fallback:", err);
    }
    return false;
  }

  static applyMeasurements(measurements: ConfirmedMeasurements): boolean {
    if (!this.wasmEngine) return false;
    try {
      // OxiHuman measurements input
      const heightMeters = measurements.heightCm / 100;
      this.wasmEngine.set_height(heightMeters);

      // Normalize girths against standard human ratios (chest ~ 100cm, waist ~ 80cm, hip ~ 100cm)
      const normChest = Math.max(0.0, Math.min(1.0, (measurements.chestCm - 70) / 70));
      const normWaist = Math.max(0.0, Math.min(1.0, (measurements.waistCm - 55) / 75));
      const normHip = Math.max(0.0, Math.min(1.0, (measurements.hipCm - 70) / 75));

      this.wasmEngine.set_param("chest", normChest);
      this.wasmEngine.set_param("waist", normWaist);
      this.wasmEngine.set_param("hip", normHip);

      if (measurements.weightKg) {
        const normWeight = Math.max(0.0, Math.min(1.0, (measurements.weightKg - 45) / 90));
        this.wasmEngine.set_weight(normWeight);
      }

      return true;
    } catch (err) {
      console.warn("[OxiHumanAdapter] applyMeasurements error:", err);
      return false;
    }
  }

  static buildMeshBytes(): OxiHumanMeshOutput | null {
    if (!this.wasmEngine) return null;
    try {
      const bytes: Uint8Array = this.wasmEngine.build_mesh_bytes();
      if (!bytes || bytes.length < 12) return null;

      const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      const version = view.getUint32(0, true);
      const vertexCount = view.getUint32(4, true);
      const indexCount = view.getUint32(8, true);

      if (vertexCount === 0) return null;

      const posOffset = 12;
      const normOffset = posOffset + vertexCount * 12;
      const uvsOffset = normOffset + vertexCount * 12;
      const indicesOffset = uvsOffset + vertexCount * 8;

      const positions = new Float32Array(bytes.buffer, bytes.byteOffset + posOffset, vertexCount * 3);
      const normals = new Float32Array(bytes.buffer, bytes.byteOffset + normOffset, vertexCount * 3);
      const uvs = new Float32Array(bytes.buffer, bytes.byteOffset + uvsOffset, vertexCount * 2);
      const indices = new Uint32Array(bytes.buffer, bytes.byteOffset + indicesOffset, indexCount);

      return {
        positions,
        normals,
        uvs,
        indices,
        vertexCount,
        indexCount
      };
    } catch (err) {
      console.warn("[OxiHumanAdapter] buildMeshBytes error:", err);
      return null;
    }
  }

  static dispose(): void {
    if (this.wasmEngine && typeof this.wasmEngine.free === "function") {
      try {
        this.wasmEngine.free();
      } catch {
        // silent
      }
      this.wasmEngine = null;
    }
    this.isInitialized = false;
  }
}
