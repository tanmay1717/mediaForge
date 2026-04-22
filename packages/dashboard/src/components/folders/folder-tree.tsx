'use client';
import React from 'react';
import FolderItem from './folder-item';

/**
 * TODO: Recursive folder tree component
 * - Fetch root folder for the user, then lazily load children
 * - Expand/collapse each node
 * - Click folder → navigate to /folders/{path}
 * - Right-click context menu: rename, move, delete
 * - Drag-and-drop: reorder or move into another folder
 * - Visual indicators: folder icon, asset count badge
 * - Active state for current folder (from URL)
 */
interface FolderTreeProps {
  rootFolderId: string;
  activeFolderId?: string;
  onSelect?: (folderId: string) => void;
}

export default function FolderTree({ rootFolderId, activeFolderId, onSelect }: FolderTreeProps) {
  // TODO: Use useFolders() to load children, build tree recursively
  return (
    <div className="text-sm">
      {/* TODO: Render FolderItem for each child, recurse for nested */}
      <p className="text-gray-400 p-2">TODO: Implement folder tree</p>
    </div>
  );
}
