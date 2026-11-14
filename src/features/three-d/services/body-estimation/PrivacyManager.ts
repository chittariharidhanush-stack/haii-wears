export class PrivacyManager {
  private static createdUrls: Set<string> = new Set();

  static createLocalUrl(fileOrBlob: File | Blob): string {
    const url = URL.createObjectURL(fileOrBlob);
    this.createdUrls.add(url);
    return url;
  }

  static revokeUrl(url?: string): void {
    if (!url) return;
    if (this.createdUrls.has(url)) {
      try {
        URL.revokeObjectURL(url);
        this.createdUrls.delete(url);
      } catch {
        // silent
      }
    }
  }

  static revokeAll(): void {
    this.createdUrls.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // silent
      }
    });
    this.createdUrls.clear();
  }

  // Wipes image bitmap and canvas memory
  static clearCanvas(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    canvas.width = 1;
    canvas.height = 1;
  }
}
