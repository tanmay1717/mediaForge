'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function AssetDetail() {
  const params = useSearchParams();
  const id = params.get('id') || '';
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Asset Detail</h2>
      <p className="text-gray-500">Asset ID: {id}</p>
    </div>
  );
}

export default function AssetDetailPage() {
  return <Suspense fallback={<div>Loading...</div>}><AssetDetail /></Suspense>;
}
