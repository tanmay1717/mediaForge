/**
 * Materialized path utilities for the folder tree.
 * Paths look like: "/products/electronics/phones"
 */

/** Build a materialized path from parent path + folder name */
export function buildPath(parentPath: string | null, folderName: string): string {
  const parent = parentPath ?? '';
  return `${parent}/${folderName}`;
}

/** Get the parent path from a materialized path */
export function getParentPath(path: string): string | null {
  const lastSlash = path.lastIndexOf('/');
  if (lastSlash <= 0) return null;
  return path.substring(0, lastSlash);
}

/** Get the depth of a path (number of segments) */
export function getPathDepth(path: string): number {
  return path.split('/').filter(Boolean).length;
}

/** Extract the folder name from a materialized path */
export function getFolderName(path: string): string {
  const segments = path.split('/').filter(Boolean);
  return segments[segments.length - 1] ?? '';
}

/** Check if childPath is a descendant of parentPath */
export function isDescendant(parentPath: string, childPath: string): boolean {
  return childPath.startsWith(parentPath + '/');
}

/** Get the file extension from a filename */
export function getExtension(fileName: string): string {
  const dot = fileName.lastIndexOf('.');
  if (dot === -1) return '';
  return fileName.substring(dot + 1).toLowerCase();
}
