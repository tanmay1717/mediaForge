'use client';
import React from 'react';

interface ConfirmDialogProps { open: boolean; title: string; description: string; confirmLabel?: string; variant?: 'danger' | 'default'; onConfirm: () => void; onCancel: () => void; }

/**
 * TODO: 'Are you sure?' confirmation modal
 * - Title + description
 * - Cancel and Confirm buttons
 * - Danger variant: red confirm button (for deletes)
 * - Loading state on confirm button
 */
export default function ConfirmDialog(props: ConfirmDialogProps) {
  return (
    <div data-component="ConfirmDialog">
      {/* TODO: Implement ConfirmDialog */}
    </div>
  );
}
