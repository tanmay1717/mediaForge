import { TransformParams } from '../types/transform';
import { MAX_WIDTH, MAX_HEIGHT, MAX_DPR, MIN_QUALITY, MAX_QUALITY } from '../constants/transforms';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate parsed transform params against allowed ranges.
 *
 * TODO:
 * - Check width is between 1 and MAX_WIDTH
 * - Check height is between 1 and MAX_HEIGHT
 * - Check quality is between MIN_QUALITY and MAX_QUALITY (or "auto")
 * - Check dpr is between 1 and MAX_DPR
 * - Check format is one of the allowed OutputFormat values
 * - Check crop is one of the allowed CropMode values
 * - Check gravity is one of the allowed Gravity values
 * - Check aspectRatio matches pattern "number:number"
 * - Check effect.value is positive if present
 * - Check borderRadius is positive if present
 * - Check page is positive integer if present
 * - Return all errors (don't fail on first)
 */
export function validateTransformParams(params: TransformParams): ValidationResult {
  const errors: string[] = [];

  if (params.width !== undefined && (params.width < 1 || params.width > MAX_WIDTH)) {
    errors.push(`Width must be between 1 and ${MAX_WIDTH}`);
  }

  if (params.height !== undefined && (params.height < 1 || params.height > MAX_HEIGHT)) {
    errors.push(`Height must be between 1 and ${MAX_HEIGHT}`);
  }

  if (params.quality !== undefined && params.quality !== 'auto') {
    if (params.quality < MIN_QUALITY || params.quality > MAX_QUALITY) {
      errors.push(`Quality must be between ${MIN_QUALITY} and ${MAX_QUALITY}`);
    }
  }

  if (params.dpr !== undefined && (params.dpr < 1 || params.dpr > MAX_DPR)) {
    errors.push(`DPR must be between 1 and ${MAX_DPR}`);
  }

  // TODO: Add remaining validations listed above

  return { valid: errors.length === 0, errors };
}
