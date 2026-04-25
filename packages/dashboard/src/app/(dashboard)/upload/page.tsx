'use client';
import React, { useState, useCallback } from 'react';
import api from '@/lib/api-client';
import { UploadCloud, File, CheckCircle2, XCircle, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadItem {
  file: File;
  status: 'pending' | 'uploading' | 'done' | 'error';
  progress: number;
  error?: string;
  deliveryUrls?: Record<string, string>;
}

export default function UploadPage() {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState('');

  const addFiles = useCallback((files: FileList | File[]) => {
    const newItems = Array.from(files).map(file => ({
      file, status: 'pending' as const, progress: 0,
    }));
    setItems(prev => [...prev, ...newItems]);
  }, []);

  const uploadFile = async (item: UploadItem, index: number) => {
    setItems(prev => prev.map((it, i) => i === index ? { ...it, status: 'uploading' } : it));
    try {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(item.file);
      });

      const res = await api.post('/v1/upload', {
        fileName: item.file.name,
        mimeType: item.file.type,
        folderId: 'ROOT',
        fileBase64: base64,
      });

      const data = res.data?.data || res.data;
      setItems(prev => prev.map((it, i) => i === index ? {
        ...it, status: 'done', progress: 100,
        deliveryUrls: data.deliveryUrls,
      } : it));
    } catch (err: any) {
      setItems(prev => prev.map((it, i) => i === index ? {
        ...it, status: 'error', error: err.message || 'Upload failed',
      } : it));
    }
  };

  const uploadAll = () => {
    items.forEach((item, index) => {
      if (item.status === 'pending') uploadFile(item, index);
    });
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(''), 2000);
  };

  const StatusIcon = ({ status }: { status: UploadItem['status'] }) => {
    if (status === 'done') return <CheckCircle2 className="size-4 text-green-500 shrink-0" />;
    if (status === 'error') return <XCircle className="size-4 text-red-500 shrink-0" />;
    if (status === 'uploading') return <div className="size-4 rounded-full border-2 border-zinc-200 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100 animate-spin shrink-0" />;
    return <File className="size-4 text-zinc-300 dark:text-zinc-600 shrink-0" />;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
        onClick={() => document.getElementById('file-input')?.click()}
        className={cn(
          'card p-12 text-center cursor-pointer transition-colors border-2 border-dashed',
          dragOver
            ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800'
            : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
        )}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="size-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <UploadCloud className="size-5 text-zinc-400 dark:text-zinc-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Drop files here or click to browse</p>
            <p className="text-xs text-zinc-400 mt-1">Images, videos, PDFs, SVGs — up to 100 MB each</p>
          </div>
        </div>
        <input id="file-input" type="file" multiple className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)} />
      </div>

      {items.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {items.length} file{items.length !== 1 ? 's' : ''} queued
            </p>
            <button onClick={uploadAll} className="btn-primary">
              <UploadCloud className="size-3.5" />
              Upload All
            </button>
          </div>
          <div className="card divide-y divide-zinc-100 dark:divide-zinc-800">
            {items.map((item, i) => (
              <div key={i} className="p-4">
                <div className="flex items-center gap-3">
                  <StatusIcon status={item.status} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{item.file.name}</p>
                    <p className="text-xs text-zinc-400">{(item.file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  {item.status === 'uploading' && (
                    <div className="w-16 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full animate-pulse" style={{ width: '60%' }} />
                    </div>
                  )}
                  {item.error && <span className="text-xs text-red-500 shrink-0">{item.error}</span>}
                </div>

                {item.status === 'done' && item.deliveryUrls && (
                  <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5">
                    <p className="text-xs font-medium text-zinc-400 mb-2">CDN URLs</p>
                    {Object.entries(item.deliveryUrls).map(([label, url]) => (
                      <button key={label} onClick={() => copyUrl(url)}
                        className="w-full text-left flex items-center gap-2.5 p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                        <span className="text-xs font-medium text-zinc-400 w-16 shrink-0">{label}</span>
                        <code className="text-xs text-zinc-600 dark:text-zinc-400 truncate flex-1">{url}</code>
                        {copied === url
                          ? <Check className="size-3.5 text-green-500 shrink-0" />
                          : <Copy className="size-3.5 text-zinc-300 group-hover:text-zinc-500 shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
