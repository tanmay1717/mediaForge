'use client';
import React from 'react';

interface FolderPickerProps { value?: string; onChange: (folderId: string) => void; }

/**
 * TODO: Dropdown to select destination folder during upload
 * - Shows current folder name
 * - Dropdown: folder tree (simplified, flat list with indentation)
 * - 'Create new folder' option at bottom
 */
export default function FolderPicker(props: FolderPickerProps) {
  return (
    <div data-component="FolderPicker">
      {/* TODO: Implement FolderPicker */}
    </div>
  );
}
