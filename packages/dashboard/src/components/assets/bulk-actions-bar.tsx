'use client';
import React from 'react';

interface BulkActionsBarProps { selectedIds: string[]; onClear: () => void; }

/**
 * TODO: Floating action bar when multiple assets are selected
 * - Shows count: '5 assets selected'
 * - Buttons: Move, Delete, Tag, Clear selection
 * - Appears at the bottom of the screen
 * - Animate in/out
 */
export default function BulkActionsBar(props: BulkActionsBarProps) {
  return (
    <div data-component="BulkActionsBar">
      {/* TODO: Implement BulkActionsBar */}
    </div>
  );
}
