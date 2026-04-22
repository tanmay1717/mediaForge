'use client';
import React from 'react';

interface FolderItemProps { folder: { folderId: string; name: string; assetCount: number; }; isActive?: boolean; depth?: number; onSelect?: () => void; onExpand?: () => void; expanded?: boolean; }

/**
 * TODO: Single tree node
 * - Indent based on depth (padding-left: depth * 16px)
 * - Expand/collapse chevron (if has children)
 * - Folder icon (open when expanded)
 * - Name + asset count badge
 * - Click → onSelect
 * - Hover: show ... menu button
 */
export default function FolderItem(props: FolderItemProps) {
  return (
    <div data-component="FolderItem">
      {/* TODO: Implement FolderItem */}
    </div>
  );
}
