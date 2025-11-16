import type { Canvas } from "fabric";
import { jsPDF } from "jspdf";

/**
 * Export canvas to PDF
 * Credit card size: 85.6mm x 53.98mm
 */
export async function exportCanvasToPDF(
  canvas: Canvas,
  filename: string = "badge.pdf",
  options: {
    format?: "credit-card" | "a4" | "custom";
    width?: number; // mm
    height?: number; // mm
    quality?: number; // 1-3 (multiplier)
  } = {}
): Promise<void> {
  const {
    format = "credit-card",
    width = 85.6,
    height = 53.98,
    quality = 2,
  } = options;

  try {
    // Get canvas as high-quality image
    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: quality,
    });

    // Determine PDF dimensions
    let pdfWidth = width;
    let pdfHeight = height;
    let orientation: "portrait" | "landscape" = "landscape";

    if (format === "credit-card") {
      pdfWidth = 85.6;
      pdfHeight = 53.98;
      orientation = "landscape";
    } else if (format === "a4") {
      pdfWidth = 210;
      pdfHeight = 297;
      orientation = "portrait";
    }

    // Create PDF
    const pdf = new jsPDF({
      orientation,
      unit: "mm",
      format: [pdfWidth, pdfHeight],
    });

    // Add image to PDF
    pdf.addImage(dataURL, "PNG", 0, 0, pdfWidth, pdfHeight);

    // Save
    pdf.save(filename);
    
    console.log(`✅ PDF exported: ${filename}`);
    return Promise.resolve();
  } catch (error) {
    console.error("PDF export failed:", error);
    throw new Error("Failed to export PDF");
  }
}

/**
 * Export canvas to PNG
 */
export async function exportCanvasToPNG(
  canvas: Canvas,
  filename: string = "badge.png",
  options: {
    quality?: number; // 1-4 (multiplier)
    backgroundColor?: string;
  } = {}
): Promise<void> {
  const { quality = 3, backgroundColor } = options;

  try {
    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: quality,
      backgroundColor: backgroundColor || "transparent",
    });

    // Create download link
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`✅ PNG exported: ${filename}`);
    return Promise.resolve();
  } catch (error) {
    console.error("PNG export failed:", error);
    throw new Error("Failed to export PNG");
  }
}

/**
 * Export canvas to JPG
 */
export async function exportCanvasToJPG(
  canvas: Canvas,
  filename: string = "badge.jpg",
  options: {
    quality?: number; // 1-4 (multiplier)
    backgroundColor?: string;
  } = {}
): Promise<void> {
  const { quality = 3, backgroundColor = "#ffffff" } = options;

  try {
    const dataURL = canvas.toDataURL({
      format: "jpeg",
      quality: 0.95,
      multiplier: quality,
      backgroundColor,
    });

    const link = document.createElement("a");
    link.download = filename;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`✅ JPG exported: ${filename}`);
    return Promise.resolve();
  } catch (error) {
    console.error("JPG export failed:", error);
    throw new Error("Failed to export JPG");
  }
}

/**
 * Get canvas preview as base64
 */
export function getCanvasPreview(
  canvas: Canvas,
  format: "png" | "jpeg" = "png",
  multiplier: number = 1
): string {
  return canvas.toDataURL({
    format,
    quality: 1,
    multiplier,
  });
}

/**
 * Batch export multiple badges
 */
export async function batchExportPDF(
  canvasDataArray: string[],
  filename: string = "badges-batch.pdf"
): Promise<void> {
  try {
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [85.6, 53.98],
    });

    for (let i = 0; i < canvasDataArray.length; i++) {
      if (i > 0) {
        pdf.addPage();
      }
      pdf.addImage(canvasDataArray[i], "PNG", 0, 0, 85.6, 53.98);
    }

    pdf.save(filename);
    console.log(`✅ Batch PDF exported: ${canvasDataArray.length} pages`);
  } catch (error) {
    console.error("Batch export failed:", error);
    throw new Error("Failed to export batch PDF");
  }
}

