'use client';
import React, { useState, useEffect } from 'react';
import api from '@/lib/api-client';
import Link from 'next/link';

interface FolderItem {
  folderId: string;
  name: string;
  path: string;
  assetCount: number;
  totalSize: number;
  createdAt: string;
}

export default function FoldersPage() {
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newFolderName, setNewFolderName] = useState('');
  const [creating, setCreating] = useState(false);

  const loadFolders = () => {
    api.get('/v1/folders?parentFolderId=ROOT')
      .then(res => {
        const data = res.data?.data || res.data;
        setFolders(data?.items || data || []);
      })
      .catch(() => setFolders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadFolders(); }, []);

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    setCreating(true);
    try {
      await api.post('/v1/folders', { name: newFolderName.trim() });
      setNewFolderName('');
      loadFolders();
    } catch (err) {
      console.error('Failed to create folder:', err);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(var(--brand))]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Create folder */}
      <div className="card p-4 mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && createFolder()}
            className="input-field flex-1"
            placeholder="New folder name..."
          />
          <button onClick={createFolder} disabled={creating || !newFolderName.trim()} className="btn-primary">
            {creating ? 'Creating...' : 'Create Folder'}
          </button>
        </div>
      </div>

      {/* Folder list */}
      {folders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📁</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No folders yet</h3>
          <p className="text-gray-500">Create your first folder to organize assets</p>
        </div>
      ) : (
        <div className="card divide-y divide-gray-100">
          {folders.map(folder => (
            <div key={folder.folderId}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
              <span className="text-2xl">📁</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{folder.name}</p>
                <p className="text-xs text-gray-400">{folder.path}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{folder.assetCount} files</p>
                <p className="text-xs text-gray-400">{(folder.totalSize / 1024).toFixed(1)} KB</p>
              </div>
              <p className="text-xs text-gray-400">{new Date(folder.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
