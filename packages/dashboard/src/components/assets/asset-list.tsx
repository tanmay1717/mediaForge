'use client';
import React from 'react';

interface AssetListProps { folderId?: string; onSelect?: (ids: string[]) => void; }

/**
 * TODO: Table view with sortable columns
 * - Columns: checkbox, thumbnail, name, type, size, date, actions
 * - Click column header to sort (asc/desc toggle)
 * - Row click → navigate to asset detail
 * - Checkbox for bulk selection
 */
export default function AssetList(props: AssetListProps) {
  return (
    <div data-component="AssetList">
      {/* TODO: Implement AssetList */}
    </div>
  );
}
