/**
 * Passthrough handler for SVGs and raw files.
 * No transformation — just return the original buffer with correct content type.
 *
 * Used when:
 * - AssetType is SVG (SVGs don't benefit from raster transforms)
 * - AssetType is RAW (unknown file types served as-is)
 * - Delivery URL uses /v1/raw/ prefix (explicit passthrough)
 */
export async function passthrough(buffer: Buffer): Promise<Buffer> {
  return buffer;
}
