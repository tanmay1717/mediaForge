'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import api from '@/lib/api-client';
import { LayoutGrid, List, Images, FileText, Film, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssetItem {
  assetId: string;
  fileName: string;
  originalKey: string;
  mimeType: string;
  fileSize: number;
  createdAt: string;
  assetType: string;
}

type FilterType = 'all' | 'image' | 'video' | 'document';
type SortKey = 'date' | 'name' | 'size';

function getType(asset: AssetItem): FilterType {
  if (asset.assetType === 'image' || asset.mimeType?.startsWith('image/')) return 'image';
  if (asset.assetType === 'video' || asset.mimeType?.startsWith('video/')) return 'video';
  return 'document';
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const FileIcon = ({ type, className }: { type: FilterType; className?: string }) => {
  if (type === 'image') return <Images className={className} />;
  if (type === 'video') return <Film className={className} />;
  return <FileText className={className} />;
};

const filterLabels: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'image', label: 'Images' },
  { key: 'video', label: 'Videos' },
  { key: 'document', label: 'Docs' },
];

export default function AssetsPage() {
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortKey>('date');
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

  const getCdnPath = (asset: AssetItem) =>
    asset.originalKey?.replace(/^originals\//, '') || asset.fileName;

  const counts = useMemo(() => ({
    all: assets.length,
    image: assets.filter(a => getType(a) === 'image').length,
    video: assets.filter(a => getType(a) === 'video').length,
    document: assets.filter(a => getType(a) === 'document').length,
  }), [assets]);

  const filtered = useMemo(() => {
    let list = assets;
    if (filter !== 'all') list = list.filter(a => getType(a) === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a => a.fileName.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      if (sort === 'name') return a.fileName.localeCompare(b.fileName);
      if (sort === 'size') return b.fileSize - a.fileSize;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [assets, filter, search, sort]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-600 dark:border-t-zinc-100" />
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="size-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
          <Images className="size-5 text-zinc-400" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">No assets yet</h3>
        <p className="text-xs text-zinc-500 mb-5">Upload your first file to get started</p>
        <Link href="/upload" className="btn-primary">
          <Upload className="size-3.5" />
          Upload Files
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by filename..."
          className="input-field max-w-xs"
        />
        <div className="flex items-center gap-2 ml-auto">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="input-field w-auto text-xs"
          >
            <option value="date">Newest first</option>
            <option value="name">Name A–Z</option>
            <option value="size">Largest first</option>
          </select>
          <div className="flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-1.5 rounded-md transition-colors',
                viewMode === 'grid'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
              )}
            >
              <LayoutGrid className="size-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-1.5 rounded-md transition-colors',
                viewMode === 'list'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
              )}
            >
              <List className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Type filter tabs */}
      <div className="flex gap-1.5">
        {filterLabels.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium transition-colors',
              filter === key
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
            )}
          >
            {label}
            <span className={cn('ml-1.5 text-xs', filter === key ? 'opacity-70' : 'opacity-50')}>
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-zinc-500">No results for &ldquo;{search}&rdquo;</p>
          <button
            onClick={() => { setSearch(''); setFilter('all'); }}
            className="mt-2 text-xs text-zinc-400 hover:text-zinc-700 underline"
          >
            Clear filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {filtered.map(asset => {
            const type = getType(asset);
            return (
              <Link
                key={asset.assetId}
                href={`/assets/detail?id=${asset.assetId}`}
                className="card overflow-hidden hover:shadow-md transition-all group relative"
              >
                <div className="aspect-square bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                  {type === 'image' ? (
                    <img
                      src={`https://${cdnDomain}/v1/image/w_200,h_200,c_cover,f_auto/${getCdnPath(asset)}`}
                      alt={asset.fileName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <FileIcon type={type} className="size-7 text-zinc-300 dark:text-zinc-600" />
                  )}
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-zinc-900/0 group-hover:bg-zinc-900/40 transition-colors pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform bg-gradient-to-t from-zinc-900/80 to-transparent">
                  <p className="text-white text-xs font-medium truncate">{asset.fileName}</p>
                  <p className="text-zinc-300 text-xs">{formatSize(asset.fileSize)}</p>
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate">{asset.fileName}</p>
                  <p className="text-xs text-zinc-400">{formatSize(asset.fileSize)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="card divide-y divide-zinc-100 dark:divide-zinc-800">
          {filtered.map(asset => {
            const type = getType(asset);
            return (
              <Link
                key={asset.assetId}
                href={`/assets/detail?id=${asset.assetId}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <div className="size-10 bg-zinc-50 dark:bg-zinc-800 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                  {type === 'image' ? (
                    <img
                      src={`https://${cdnDomain}/v1/image/w_80,h_80,c_cover,f_auto/${getCdnPath(asset)}`}
                      alt={asset.fileName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FileIcon type={type} className="size-4 text-zinc-400 dark:text-zinc-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{asset.fileName}</p>
                  <p className="text-xs text-zinc-400">{asset.mimeType}</p>
                </div>
                <p className="text-xs text-zinc-400 shrink-0">{formatSize(asset.fileSize)}</p>
                <p className="text-xs text-zinc-400 shrink-0 hidden sm:block">
                  {new Date(asset.createdAt).toLocaleDateString()}
                </p>
              </Link>
            );
          })}
        </div>
      )}

      {filtered.length > 0 && (
        <p className="text-xs text-zinc-400 text-right">{filtered.length} of {assets.length} assets</p>
      )}
    </div>
  );
}
