'use client';
import React, { use } from 'react';

export default function FolderPage({ params }: { params: Promise<{ path: string[] }> }) {
  const { path } = use(params);
  const folderPath = path?.join('/') || '';
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Folders</h1>
      <p className="text-gray-500">Path: /{folderPath}</p>
    </div>
  );
}
