'use client';
import React from 'react';

interface AssetDetailPanelProps { assetId: string; onClose: () => void; }

/**
 * TODO: Slide-over panel with full asset details
 * - Full preview (AssetPreview component)
 * - Metadata section: dimensions, size, format, created, updated
 * - EXIF data (collapsible)
 * - Tags editor
 * - Transform URL builder (TransformBuilder component)
 * - Action buttons: download, move, rename, delete
 * - Copy delivery URL button
 */
export default function AssetDetailPanel(props: AssetDetailPanelProps) {
  return (
    <div data-component="AssetDetailPanel">
      {/* TODO: Implement AssetDetailPanel */}
    </div>
  );
}
