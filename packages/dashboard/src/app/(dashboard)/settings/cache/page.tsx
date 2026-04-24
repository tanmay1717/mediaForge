'use client';
import React from 'react';

export default function CacheSettingsPage() {
  return (
    <div className="max-w-2xl">
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Cache Management</h3>
        <p className="text-sm text-gray-500 mb-4">Purge cached image transforms from CloudFront and S3</p>
        <button className="btn-danger text-sm">Purge All Cache</button>
      </div>
    </div>
  );
}
