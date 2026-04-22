'use client';
import React from 'react';

interface AssetCardProps { asset: { assetId: string; fileName: string; mimeType: string; fileSize: number; width: number | null; height: number | null; createdAt: string; }; selected?: boolean; onSelect?: () => void; onClick?: () => void; }

/**
 * TODO: Single grid item: thumbnail + metadata overlay
 * - Thumbnail loaded from CDN URL with w_200,h_200,c_cover,f_auto
 * - File type icon badge (top-left corner)
 * - Filename (truncated), file size (bottom)
 * - Hover: show checkbox + action buttons
 * - Selected state: blue border
 */
export default function AssetCard(props: AssetCardProps) {
  return (
    <div data-component="AssetCard">
      {/* TODO: Implement AssetCard */}
    </div>
  );
}
