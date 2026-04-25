'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api-client';
import { FileText, Copy, Check, ArrowLeft } from 'lucide-react';

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
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-600 dark:border-t-zinc-100" />
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p className="text-sm text-zinc-500">Asset not found</p>
        <Link href="/assets" className="mt-3 text-xs text-zinc-400 hover:text-zinc-600 flex items-center gap-1">
          <ArrowLeft className="size-3.5" />
          Back to library
        </Link>
      </div>
    );
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

  const metaRows = [
    { label: 'File name', value: asset.fileName },
    { label: 'Type', value: asset.mimeType },
    { label: 'Size', value: `${(asset.fileSize / 1024).toFixed(1)} KB` },
    ...(asset.width ? [{ label: 'Dimensions', value: `${asset.width} × ${asset.height}` }] : []),
    { label: 'Uploaded', value: new Date(asset.createdAt).toLocaleString() },
    { label: 'Asset ID', value: asset.assetId, mono: true },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <Link href="/assets" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 mb-5 transition-colors">
        <ArrowLeft className="size-3.5" />
        Back to library
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-4">
          <p className="text-xs font-medium text-zinc-400 mb-3">Preview</p>
          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg overflow-hidden flex items-center justify-center min-h-[300px]">
            {isImage ? (
              <img src={transformUrl} alt={asset.fileName} className="max-w-full max-h-[500px] object-contain" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-zinc-300 dark:text-zinc-600">
                <FileText className="size-10" />
                <span className="text-xs">{asset.mimeType}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-4">
            <p className="text-xs font-medium text-zinc-400 mb-3">Details</p>
            <div className="space-y-2.5">
              {metaRows.map(({ label, value, mono }) => (
                <div key={label} className="flex justify-between items-baseline gap-4">
                  <span className="text-xs text-zinc-400 shrink-0">{label}</span>
                  <span className={`text-xs font-medium truncate ${mono ? 'font-mono text-zinc-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {isImage && (
            <div className="card p-4">
              <p className="text-xs font-medium text-zinc-400 mb-3">Transform Builder</p>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-zinc-500">Width</label>
                    <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{width}px</span>
                  </div>
                  <input type="range" min="50" max="2000" value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full accent-zinc-900 dark:accent-zinc-100" />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Format</label>
                  <select value={format} onChange={(e) => setFormat(e.target.value)} className="input-field">
                    <option value="auto">Auto (best for browser)</option>
                    <option value="webp">WebP</option>
                    <option value="avif">AVIF</option>
                    <option value="jpg">JPEG</option>
                    <option value="png">PNG</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Quality</label>
                  <select value={quality} onChange={(e) => setQuality(e.target.value)} className="input-field">
                    <option value="auto">Auto</option>
                    <option value="90">90 — High</option>
                    <option value="75">75 — Medium</option>
                    <option value="50">50 — Low</option>
                    <option value="25">25 — Very Low</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="card p-4">
            <p className="text-xs font-medium text-zinc-400 mb-3">CDN URLs</p>
            <div className="space-y-1.5">
              {[
                { label: 'Transform', url: transformUrl },
                { label: 'Original', url: originalUrl },
              ].map(({ label, url }) => (
                <button key={label} onClick={() => copyUrl(url)}
                  className="w-full text-left flex items-center gap-2.5 p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                  <span className="text-xs font-medium text-zinc-400 w-14 shrink-0">{label}</span>
                  <code className="text-xs text-zinc-600 dark:text-zinc-400 truncate flex-1">{url}</code>
                  {copied === url
                    ? <Check className="size-3.5 text-green-500 shrink-0" />
                    : <Copy className="size-3.5 text-zinc-300 group-hover:text-zinc-500 shrink-0" />}
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
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-600 dark:border-t-zinc-100" />
      </div>
    }>
      <AssetDetail />
    </Suspense>
  );
}
