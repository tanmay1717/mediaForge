import sharp from 'sharp';
import { ResolvedTransformParams } from '@media-forge/core';

/**
 * Core image transformation pipeline using Sharp.
 * Processes in a single pass: resize → effects → format → output
 */
export async function transformImage(
  buffer: Buffer,
  params: ResolvedTransformParams,
): Promise<Buffer> {
  let pipeline = sharp(buffer);

  // 1. RESIZE
  if (params.width || params.height) {
    const width = params.width ? params.width * (params.dpr || 1) : undefined;
    const height = params.height ? params.height * (params.dpr || 1) : undefined;

    pipeline = pipeline.resize({
      width,
      height,
      fit: mapCropToFit(params.crop),
      position: mapGravityToPosition(params.gravity),
      withoutEnlargement: true,
    });
  }

  // 2. EFFECTS
  if (params.effect) {
    switch (params.effect.name) {
      case 'blur':
        pipeline = pipeline.blur(params.effect.value || 5);
        break;
      case 'sharpen':
        pipeline = pipeline.sharpen(params.effect.value || 1);
        break;
      case 'grayscale':
        pipeline = pipeline.grayscale();
        break;
      case 'sepia':
        pipeline = pipeline.recomb([
          [0.393, 0.769, 0.189],
          [0.349, 0.686, 0.168],
          [0.272, 0.534, 0.131],
        ]);
        break;
    }
  }

  // 3. FORMAT + QUALITY
  const quality = params.resolvedQuality;

  switch (params.resolvedFormat) {
    case 'avif':
      pipeline = pipeline.avif({ quality });
      break;
    case 'webp':
      pipeline = pipeline.webp({ quality });
      break;
    case 'png':
      pipeline = pipeline.png({ compressionLevel: 9 });
      break;
    case 'gif':
      pipeline = pipeline.gif();
      break;
    case 'jpg':
    default:
      pipeline = pipeline.jpeg({
        quality,
        progressive: params.flags?.includes('progressive') ?? false,
      });
      break;
  }

  // 4. STRIP METADATA
  if (params.flags?.includes('strip')) {
    pipeline = pipeline.withMetadata();
  }

  return pipeline.toBuffer();
}

function mapCropToFit(crop?: string): sharp.FitEnum[keyof sharp.FitEnum] {
  const map: Record<string, keyof sharp.FitEnum> = {
    fill: 'fill',
    fit: 'inside',
    cover: 'cover',
    contain: 'contain',
    thumb: 'cover',
  };
  return sharp.fit[map[crop || 'cover'] || 'cover'];
}

function mapGravityToPosition(gravity?: string): string {
  const map: Record<string, string> = {
    center: 'centre',
    north: 'north',
    south: 'south',
    east: 'east',
    west: 'west',
    northeast: 'northeast',
    northwest: 'northwest',
    southeast: 'southeast',
    southwest: 'southwest',
    face: 'attention',
    auto: 'entropy',
  };
  return map[gravity || 'center'] || 'centre';
}
