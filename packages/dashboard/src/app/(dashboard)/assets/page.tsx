'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api-client';

interface AssetItem {
  assetId: string;
  fileName: string;
  originalKey: string;
  mimeType: string;
  fileSize: number;
  createdAt: string;
  assetType: string;
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const cdnDomain = process.env.NEXT_PUBLIC_CDN_DOMAIN || 'cdn.tanmayshetty.com';

  useEffect(() => {
    api.get('/v1/assets')
      .then(res => {
        const data = res.data?.data || res.data;
        setAssets(data?.items || []);
      })
      .catch(() => setAssets([]))
      .finally(() => setLoading(false));
  }, []);

  // Strip "originals/" prefix from S3 key to get CDN path
  const getCdnPath = (asset: AssetItem) => {
    const path = asset.originalKey?.replace(/^originals\//, '') || asset.fileName;
    return path;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(var(--brand))]" />
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">🖼️</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No assets yet</h3>
        <p className="text-gray-500 mb-6">Upload your first file to get started</p>
        <Link href="/upload" className="btn-primary">Upload Files</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{assets.length} assets</p>
        <div className="flex gap-2">
          <button onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 text-sm rounded-lg ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
            Grid
          </button>
          <button onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 text-sm rounded-lg ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
            List
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {assets.map(asset => (
            <Link key={asset.assetId} href={`/assets/detail?id=${asset.assetId}`}
              className="card overflow-hidden hover:shadow-md transition-shadow group">
              <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                {asset.assetType === 'image' || asset.mimeType?.startsWith('image/') ? (
                  <img
                    src={`https://${cdnDomain}/v1/image/w_200,h_200,c_cover,f_auto/${getCdnPath(asset)}`}
                    alt={asset.fileName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <span className="text-3xl">📄</span>
                )}
              </div>
              <div className="p-2">
                <p className="text-xs font-medium text-gray-900 truncate">{asset.fileName}</p>
                <p className="text-xs text-gray-400">{(asset.fileSize / 1024).toFixed(1)} KB</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card divide-y divide-gray-100">
          {assets.map(asset => (
            <Link key={asset.assetId} href={`/assets/detail?id=${asset.assetId}`}
              className="flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                {asset.assetType === 'image' || asset.mimeType?.startsWith('image/') ? (
                  <img
                    src={`https://${cdnDomain}/v1/image/w_80,h_80,c_cover,f_auto/${getCdnPath(asset)}`}
                    alt={asset.fileName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>📄</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{asset.fileName}</p>
                <p className="text-xs text-gray-400">{asset.mimeType}</p>
              </div>
              <p className="text-xs text-gray-400">{(asset.fileSize / 1024).toFixed(1)} KB</p>
              <p className="text-xs text-gray-400">{new Date(asset.createdAt).toLocaleDateString()}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
