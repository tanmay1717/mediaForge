'use client';
import React from 'react';

interface AssetActionsProps { assetId: string; onAction?: (action: string) => void; }

/**
 * TODO: Action dropdown menu for a single asset
 * - Download original
 * - Copy delivery URL
 * - Move to folder → MoveDialog
 * - Rename → inline edit or dialog
 * - Delete → ConfirmDialog
 * - Open in new tab
 */
export default function AssetActions(props: AssetActionsProps) {
  return (
    <div data-component="AssetActions">
      {/* TODO: Implement AssetActions */}
    </div>
  );
}
