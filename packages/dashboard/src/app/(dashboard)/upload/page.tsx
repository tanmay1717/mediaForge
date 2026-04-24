'use client';
import React, { useState, useCallback } from 'react';
import { useAuth } from '@/providers/auth-provider';
import api from '@/lib/api-client';

interface UploadItem {
  file: File;
  status: 'pending' | 'uploading' | 'done' | 'error';
  progress: number;
  error?: string;
}

export default function UploadPage() {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const { accessToken } = useAuth();
  const cdnDomain = process.env.NEXT_PUBLIC_CDN_DOMAIN || 'cdn.tanmayshetty.com';

  const addFiles = useCallback((files: FileList | File[]) => {
    const newItems = Array.from(files).map(file => ({
      file,
      status: 'pending' as const,
      progress: 0,
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

      await api.post('/v1/upload', {
        fileName: item.file.name,
        mimeType: item.file.type,
        folderId: 'ROOT',
        fileBase64: base64,
      });

      setItems(prev => prev.map((it, i) => i === index ? { ...it, status: 'done', progress: 100 } : it));
    } catch (err: any) {
      setItems(prev => prev.map((it, i) => i === index ? { ...it, status: 'error', error: err.message } : it));
    }
  };

  const uploadAll = () => {
    items.forEach((item, index) => {
      if (item.status === 'pending') uploadFile(item, index);
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
        onClick={() => document.getElementById('file-input')?.click()}
        className={`card p-12 text-center cursor-pointer transition-colors border-2 border-dashed
          ${dragOver ? 'border-[rgb(var(--brand))] bg-[rgb(var(--brand))]/5' : 'border-gray-300 hover:border-gray-400'}`}
      >
        <div className="text-4xl mb-3">📤</div>
        <p className="text-lg font-medium text-gray-700">Drop files here or click to browse</p>
        <p className="text-sm text-gray-400 mt-1">Images, videos, PDFs, SVGs — up to 100MB each</p>
        <input
          id="file-input"
          type="file"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </div>

      {/* Upload queue */}
      {items.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">{items.length} file(s) selected</h3>
            <button onClick={uploadAll} className="btn-primary text-sm">Upload All</button>
          </div>
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="card p-3 flex items-center gap-3">
                <span className="text-lg">
                  {item.status === 'done' ? '✅' : item.status === 'error' ? '❌' : item.status === 'uploading' ? '⏳' : '📄'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.file.name}</p>
                  <p className="text-xs text-gray-400">{(item.file.size / 1024).toFixed(1)} KB</p>
                </div>
                {item.status === 'uploading' && (
                  <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[rgb(var(--brand))] rounded-full animate-pulse" style={{ width: '60%' }} />
                  </div>
                )}
                {item.error && <span className="text-xs text-red-500">{item.error}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
