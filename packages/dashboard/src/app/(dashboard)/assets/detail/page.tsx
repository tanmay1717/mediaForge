'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api-client';

const CDN = process.env.NEXT_PUBLIC_CDN_DOMAIN || 'cdn.tanmayshetty.com';

function AssetDetail() {
  const params = useSearchParams();
  const id = params.get('id') || '';
  const [asset, setAsset] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState('');
  const [width, setWidth] = useState(800);
  const [format, setFormat] = useState('auto');
  const [quality, setQuality] = useState('auto');

  useEffect(() => {
    if (!id) return;
    api.get(`/v1/assets/${id}`)
      .then(res => setAsset(res.data?.data || res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!asset) {
    return <div className="text-center py-20 text-gray-500">Asset not found</div>;
  }

  const cdnPath = asset.originalKey?.replace(/^originals\//, '') || asset.fileName;
  const transformUrl = `https://${CDN}/v1/image/w_${width},f_${format},q_${quality}/${cdnPath}`;
  const originalUrl = `https://${CDN}/v1/raw/${cdnPath}`;

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(''), 2000);
  };

  const isImage = asset.mimeType?.startsWith('image/');

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Preview */}
        <div className="card p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Preview</h3>
          <div className="bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center min-h-[300px]">
            {isImage ? (
              <img src={transformUrl} alt={asset.fileName} className="max-w-full max-h-[500px] object-contain" />
            ) : (
              <span className="text-5xl">📄</span>
            )}
          </div>
        </div>

        {/* Info + URLs */}
        <div className="space-y-4">
          {/* Metadata */}
          <div className="card p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">File name</span>
                <span className="font-medium">{asset.fileName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Type</span>
                <span className="font-medium">{asset.mimeType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Size</span>
                <span className="font-medium">{(asset.fileSize / 1024).toFixed(1)} KB</span>
              </div>
              {asset.width && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Dimensions</span>
                  <span className="font-medium">{asset.width} × {asset.height}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Uploaded</span>
                <span className="font-medium">{new Date(asset.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Asset ID</span>
                <span className="font-mono text-xs text-gray-400">{asset.assetId}</span>
              </div>
            </div>
          </div>

          {/* Transform Builder */}
          {isImage && (
            <div className="card p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Transform Builder</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500">Width: {width}px</label>
                  <input type="range" min="50" max="2000" value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Format</label>
                  <select value={format} onChange={(e) => setFormat(e.target.value)} className="input-field mt-1">
                    <option value="auto">Auto (best for browser)</option>
                    <option value="webp">WebP</option>
                    <option value="avif">AVIF</option>
                    <option value="jpg">JPEG</option>
                    <option value="png">PNG</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Quality</label>
                  <select value={quality} onChange={(e) => setQuality(e.target.value)} className="input-field mt-1">
                    <option value="auto">Auto</option>
                    <option value="90">90 (High)</option>
                    <option value="75">75 (Medium)</option>
                    <option value="50">50 (Low)</option>
                    <option value="25">25 (Very Low)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* CDN URLs */}
          <div className="card p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3">CDN URLs</h3>
            <div className="space-y-2">
              {[
                { label: 'Transform', url: transformUrl },
                { label: 'Original', url: originalUrl },
              ].map(({ label, url }) => (
                <button key={label} onClick={() => copyUrl(url)}
                  className="w-full text-left flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
                  <span className="text-xs font-medium text-gray-400 w-16">{label}</span>
                  <code className="text-xs text-gray-600 truncate flex-1">{url}</code>
                  <span className="text-xs text-gray-400 group-hover:text-blue-500">
                    {copied === url ? '✓ Copied!' : 'Copy'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AssetDetailPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    }>
      <AssetDetail />
    </Suspense>
  );
}
