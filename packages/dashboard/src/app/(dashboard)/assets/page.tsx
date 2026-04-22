'use client';
import React from 'react';

/**
 * TODO: Media library page
 * - Grid/list view toggle
 * - FilterBar: type filter, date range, tag filter, sort
 * - SearchInput: debounced search
 * - AssetGrid or AssetList (based on view mode)
 * - BulkActionsBar: appears when assets are selected
 * - Infinite scroll pagination
 * - Click asset → open detail panel or navigate to /assets/[id]
 */
export default function AssetsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Media Library</h1>
      {/* TODO: Implement asset grid with filters */}
      <p className="text-gray-500">TODO: Implement media library</p>
    </div>
  );
}
