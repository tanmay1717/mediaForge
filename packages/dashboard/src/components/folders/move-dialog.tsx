'use client';
import React from 'react';

interface MoveDialogProps { itemType: 'asset' | 'folder'; itemIds: string[]; open: boolean; onClose: () => void; }

/**
 * TODO: Tree picker dialog for moving assets/folders
 * - Show the full folder tree
 * - Click a folder to select as destination
 * - Disable the current folder and its descendants (can't move into self)
 * - Move button with loading state
 */
export default function MoveDialog(props: MoveDialogProps) {
  return (
    <div data-component="MoveDialog">
      {/* TODO: Implement MoveDialog */}
    </div>
  );
}
