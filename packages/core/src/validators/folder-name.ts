import { MAX_FOLDER_NAME_LENGTH } from '../constants/limits';

/**
 * Validate a folder name for creation or rename.
 *
 * TODO:
 * - Check name is not empty
 * - Check name length <= MAX_FOLDER_NAME_LENGTH
 * - Check name does not contain: / \ : * ? " < > |
 * - Check name is not "." or ".."
 * - Check name does not start or end with whitespace
 * - Trim and return sanitized name
 */
export function validateFolderName(name: string): { valid: boolean; sanitized: string; error?: string } {
  const trimmed = name.trim();

  if (!trimmed) {
    return { valid: false, sanitized: '', error: 'Folder name cannot be empty' };
  }

  if (trimmed.length > MAX_FOLDER_NAME_LENGTH) {
    return { valid: false, sanitized: trimmed, error: `Folder name exceeds ${MAX_FOLDER_NAME_LENGTH} characters` };
  }

  // TODO: Add remaining validations listed above

  return { valid: true, sanitized: trimmed };
}
