'use client';
import React, { use } from 'react';

export default function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Asset Detail</h1>
      <p className="text-gray-500">Asset ID: {id}</p>
    </div>
  );
}
