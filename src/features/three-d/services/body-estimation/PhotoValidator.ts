import { PhotoValidationResult } from "../../types/MeasurementTypes";

export class PhotoValidator {
  static async validateImage(file: File | Blob): Promise<{
    result: PhotoValidationResult;
    imageElement: HTMLImageElement;
  }> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        URL.revokeObjectURL(url);
        const warnings: string[] = [];
        const errors: string[] = [];

        // 1. Resolution Check
        if (img.width < 320 || img.height < 480) {
          errors.push("Photograph resolution is too low for body estimation. Minimum 320x480px required.");
        }

        // 2. Aspect Ratio (Full-body photos should ideally be portrait)
        const aspectRatio = img.width / img.height;
        if (aspectRatio > 1.2) {
          warnings.push("Landscape orientation detected. Ensure your full body from head to feet is visible.");
        }

        // 3. Brightness / Contrast Check via sample canvas
        const canvas = document.createElement("canvas");
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext("2d");
        let avgBrightness = 128;

        if (ctx) {
          ctx.drawImage(img, 0, 0, 100, 100);
          const imageData = ctx.getImageData(0, 0, 100, 100);
          let sum = 0;
          for (let i = 0; i < imageData.data.length; i += 4) {
            sum += (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
          }
          avgBrightness = sum / (imageData.data.length / 4);

          if (avgBrightness < 35) {
            warnings.push("Photograph appears underexposed. Better lighting improves measurement accuracy.");
          } else if (avgBrightness > 225) {
            warnings.push("Photograph appears overexposed. Reduce harsh glare for optimal body silhouette detection.");
          }
        }

        const isValid = errors.length === 0;

        resolve({
          result: {
            isValid,
            warnings,
            errors,
            detectedLandmarksCount: 0,
            orientation: "front",
            postureGrade: errors.length > 0 ? "suboptimal" : warnings.length > 0 ? "acceptable" : "optimal"
          },
          imageElement: img
        });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to decode uploaded image."));
      };

      img.src = url;
    });
  }
}
