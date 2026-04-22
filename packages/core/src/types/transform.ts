export type OutputFormat = 'auto' | 'webp' | 'avif' | 'png' | 'jpg' | 'gif';
export type CropMode = 'fill' | 'fit' | 'cover' | 'contain' | 'thumb';
export type Gravity = 'center' | 'north' | 'south' | 'east' | 'west'
  | 'northeast' | 'northwest' | 'southeast' | 'southwest' | 'face' | 'auto';
export type Effect = 'blur' | 'sharpen' | 'grayscale' | 'sepia';

/** Parsed transform params extracted from delivery URL segment
 *  e.g. "w_500,h_300,f_auto,q_80,c_fill,g_center" */
export interface TransformParams {
  width?: number;
  height?: number;
  format?: OutputFormat;
  quality?: number | 'auto';
  crop?: CropMode;
  gravity?: Gravity;
  aspectRatio?: string;        // "16:9"
  effect?: { name: Effect; value?: number };
  dpr?: number;                // device pixel ratio 1-3
  backgroundColor?: string;    // hex without #
  borderRadius?: number;
  page?: number;               // PDF page number
  flags?: string[];            // "progressive", "strip", "lossy"
}

/** After resolving "auto" values — this is what Sharp actually receives */
export interface ResolvedTransformParams extends TransformParams {
  resolvedFormat: Exclude<OutputFormat, 'auto'>;
  resolvedQuality: number;
}
