'use client';
import React from 'react';

export default function UsageSettingsPage() {
  return (
    <div className="max-w-2xl">
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Usage Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500">Storage</p>
            <p className="text-xl font-bold">—</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500">Bandwidth</p>
            <p className="text-xl font-bold">—</p>
          </div>
        </div>
      </div>
    </div>
  );
}
