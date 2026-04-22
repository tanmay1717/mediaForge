'use client';
import React from 'react';

interface CreateFolderDialogProps { parentFolderId?: string; open: boolean; onClose: () => void; onCreate?: (folder: unknown) => void; }

/**
 * TODO: Dialog for creating a new folder
 * - Folder name input with validation (validateFolderName from core)
 * - Parent folder display (read-only)
 * - Create button with loading state
 * - Call useCreateFolder() mutation on submit
 */
export default function CreateFolderDialog(props: CreateFolderDialogProps) {
  return (
    <div data-component="CreateFolderDialog">
      {/* TODO: Implement CreateFolderDialog */}
    </div>
  );
}
