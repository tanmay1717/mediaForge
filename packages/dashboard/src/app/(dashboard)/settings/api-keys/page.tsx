'use client';
import React from 'react';

export default function ApiKeysPage() {
  return (
    <div className="max-w-2xl">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">API Keys</h3>
          <button className="btn-primary text-sm">Create Key</button>
        </div>
        <p className="text-sm text-gray-500">No API keys yet. Create one for programmatic access.</p>
      </div>
    </div>
  );
}
