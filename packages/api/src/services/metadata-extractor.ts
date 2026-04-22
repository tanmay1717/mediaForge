/**
 * Extract metadata from uploaded files using Sharp (images) or other tools.
 *
 * TODO:
 * - extractImageMetadata: Use Sharp to get width, height, format, space, channels, EXIF
 *   sharp(buffer).metadata() returns all of this
 * - extractVideoMetadata: Use ffprobe (child process) to get width, height, duration, codec
 *   This requires a Lambda layer with ffprobe binary
 * - extractPdfMetadata: Use pdf-lib to get page count
 *   const pdfDoc = await PDFDocument.load(buffer); pdfDoc.getPageCount()
 */
export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  space: string;
  channels: number;
  exif: Record<string, unknown>;
}

export interface VideoMetadata {
  width: number;
  height: number;
  duration: number;
  codec: string;
}

export interface PdfMetadata {
  pageCount: number;
}

export async function extractImageMetadata(_buffer: Buffer): Promise<ImageMetadata> {
  // TODO: const metadata = await sharp(buffer).metadata();
  // TODO: Extract EXIF data from metadata.exif using exif-reader
  return { width: 0, height: 0, format: 'unknown', space: 'srgb', channels: 3, exif: {} };
}

export async function extractVideoMetadata(_buffer: Buffer): Promise<VideoMetadata> {
  // TODO: Write buffer to /tmp, run ffprobe, parse JSON output
  return { width: 0, height: 0, duration: 0, codec: 'unknown' };
}

export async function extractPdfMetadata(_buffer: Buffer): Promise<PdfMetadata> {
  // TODO: const pdfDoc = await PDFDocument.load(buffer);
  return { pageCount: 0 };
}
