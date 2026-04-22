import { CropMode, Gravity, OutputFormat } from '../types/transform';

/** Default values applied when a transform param is not specified in the URL */
export const TRANSFORM_DEFAULTS = {
  quality: 80,
  crop: 'cover' as CropMode,
  gravity: 'center' as Gravity,
  dpr: 1,
  format: 'auto' as OutputFormat,
} as const;

/** Format negotiation priority order (best → worst) */
export const FORMAT_PRIORITY: Exclude<OutputFormat, 'auto'>[] = [
  'avif',
  'webp',
  'jpg',
  'png',
  'gif',
];

/** Max dimensions to prevent abuse */
export const MAX_WIDTH = 8192;
export const MAX_HEIGHT = 8192;
export const MAX_DPR = 3;
export const MIN_QUALITY = 1;
export const MAX_QUALITY = 100;
