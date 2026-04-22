import { TransformParams } from '../types/transform';

/**
 * Build a delivery URL from TransformParams + asset path.
 * Inverse of parseTransforms — used by the dashboard URL builder.
 *
 * Input:  { width: 500, format: "auto" }, "products/hero.jpg", "cdn.example.com"
 * Output: "https://cdn.example.com/v1/image/w_500,f_auto/products/hero.jpg"
 *
 * TODO:
 * - Build the transform segment by mapping each non-undefined param to its key_value string
 * - Join with commas
 * - Determine asset type from file extension (image/video/document/raw)
 * - Construct the full URL: https://{domain}/v1/{type}/{transforms}/{path}
 * - If no transforms, use the "raw" type for passthrough
 */
export function buildDeliveryUrl(
  params: TransformParams,
  assetPath: string,
  domain: string,
): string {
  const segments: string[] = [];

  if (params.width) segments.push(`w_${params.width}`);
  if (params.height) segments.push(`h_${params.height}`);
  if (params.format) segments.push(`f_${params.format}`);
  if (params.quality) segments.push(`q_${params.quality}`);
  if (params.crop) segments.push(`c_${params.crop}`);
  if (params.gravity) segments.push(`g_${params.gravity}`);
  if (params.aspectRatio) segments.push(`ar_${params.aspectRatio}`);
  if (params.effect) {
    const effectStr = params.effect.value
      ? `${params.effect.name}:${params.effect.value}`
      : params.effect.name;
    segments.push(`e_${effectStr}`);
  }
  if (params.dpr) segments.push(`dpr_${params.dpr}`);
  if (params.backgroundColor) segments.push(`bg_${params.backgroundColor}`);
  if (params.borderRadius) segments.push(`r_${params.borderRadius}`);
  if (params.page) segments.push(`pg_${params.page}`);
  if (params.flags) params.flags.forEach((f) => segments.push(`fl_${f}`));

  const transformSegment = segments.join(',');
  const assetType = segments.length > 0 ? resolveTypeFromPath(assetPath) : 'raw';
  const path = transformSegment
    ? `${assetType}/${transformSegment}/${assetPath}`
    : `raw/${assetPath}`;

  return `https://${domain}/v1/${path}`;
}

/** Infer the delivery asset type from file extension */
function resolveTypeFromPath(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase() ?? '';
  if (['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'tiff'].includes(ext)) return 'image';
  if (['mp4', 'webm', 'mov'].includes(ext)) return 'video';
  if (['pdf'].includes(ext)) return 'document';
  return 'raw';
}
