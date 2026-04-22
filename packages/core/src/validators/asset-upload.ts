import { MAX_FILE_SIZE } from '../constants/limits';
import { ALLOWED_MIME_TYPES } from '../constants/mime-types';

export interface UploadValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate an incoming file upload before processing.
 *
 * TODO:
 * - Check fileSize does not exceed MAX_FILE_SIZE
 * - Check mimeType is in ALLOWED_MIME_TYPES
 * - Check fileName does not contain path traversal characters (../ etc.)
 * - Check fileName length is <= 255 characters
 * - Check fileName does not contain null bytes
 * - Return all errors (don't fail on first)
 */
export function validateUpload(
  fileName: string,
  mimeType: string,
  fileSize: number,
): UploadValidationResult {
  const errors: string[] = [];

  if (fileSize > MAX_FILE_SIZE) {
    errors.push(`File size ${fileSize} exceeds maximum ${MAX_FILE_SIZE}`);
  }

  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    errors.push(`MIME type ${mimeType} is not supported`);
  }

  // TODO: Add remaining validations listed above

  return { valid: errors.length === 0, errors };
}
