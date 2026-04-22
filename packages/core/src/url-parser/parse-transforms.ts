import { TransformParams, OutputFormat, CropMode, Gravity, Effect } from '../types/transform';

/**
 * Parse a URL transform segment into structured TransformParams.
 * Input:  "w_500,h_300,f_auto,q_80,c_fill,g_center,e_blur:10"
 * Output: { width: 500, height: 300, format: "auto", quality: 80, ... }
 *
 * TODO:
 * - Split the segment by "," to get individual params
 * - For each param, split by "_" to get key and value
 * - Map each key to the correct TransformParams field:
 *     w → width (parseInt)
 *     h → height (parseInt)
 *     f → format (validate against OutputFormat)
 *     q → quality (parseInt or "auto")
 *     c → crop (validate against CropMode)
 *     g → gravity (validate against Gravity)
 *     ar → aspectRatio (keep as string "16:9")
 *     e → effect (split by ":" for name:value)
 *     dpr → dpr (parseInt)
 *     bg → backgroundColor (hex string)
 *     r → borderRadius (parseInt)
 *     pg → page (parseInt)
 *     fl → flags (push to array)
 * - Ignore unknown keys (forward compatibility)
 * - Return the populated TransformParams object
 */
export function parseTransforms(segment: string): TransformParams {
  const params: TransformParams = {};

  if (!segment) return params;

  const parts = segment.split(',');

  for (const part of parts) {
    const underscoreIndex = part.indexOf('_');
    if (underscoreIndex === -1) continue;

    const key = part.substring(0, underscoreIndex);
    const value = part.substring(underscoreIndex + 1);

    switch (key) {
      case 'w':
        params.width = parseInt(value, 10);
        break;
      case 'h':
        params.height = parseInt(value, 10);
        break;
      case 'f':
        params.format = value as OutputFormat;
        break;
      case 'q':
        params.quality = value === 'auto' ? 'auto' : parseInt(value, 10);
        break;
      case 'c':
        params.crop = value as CropMode;
        break;
      case 'g':
        params.gravity = value as Gravity;
        break;
      case 'ar':
        params.aspectRatio = value;
        break;
      case 'e': {
        const [effectName, effectVal] = value.split(':');
        params.effect = {
          name: effectName as Effect,
          value: effectVal ? parseInt(effectVal, 10) : undefined,
        };
        break;
      }
      case 'dpr':
        params.dpr = parseInt(value, 10);
        break;
      case 'bg':
        params.backgroundColor = value;
        break;
      case 'r':
        params.borderRadius = parseInt(value, 10);
        break;
      case 'pg':
        params.page = parseInt(value, 10);
        break;
      case 'fl':
        params.flags = params.flags || [];
        params.flags.push(value);
        break;
      default:
        // Unknown param — ignore for forward compatibility
        break;
    }
  }

  return params;
}
