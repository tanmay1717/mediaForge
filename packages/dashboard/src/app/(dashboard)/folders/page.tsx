'use client';
import React, { useState, useEffect } from 'react';
import api from '@/lib/api-client';
import { Folder, FolderPlus, Plus } from 'lucide-react';

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
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-600 dark:border-t-zinc-100" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div className="card p-4">
        <div className="flex gap-2.5">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && createFolder()}
            className="input-field flex-1"
            placeholder="New folder name"
          />
          <button onClick={createFolder} disabled={creating || !newFolderName.trim()} className="btn-primary">
            <Plus className="size-3.5" />
            {creating ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>

      {folders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="size-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
            <FolderPlus className="size-5 text-zinc-400" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">No folders yet</h3>
          <p className="text-xs text-zinc-500">Create a folder to organise your assets</p>
        </div>
      ) : (
        <div className="card divide-y divide-zinc-100 dark:divide-zinc-800">
          {folders.map(folder => (
            <div key={folder.folderId}
              className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
              <div className="size-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                <Folder className="size-4 text-zinc-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{folder.name}</p>
                <p className="text-xs text-zinc-400">{folder.path}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">{folder.assetCount} files</p>
                <p className="text-xs text-zinc-400">{(folder.totalSize / 1024).toFixed(1)} KB</p>
              </div>
              <p className="text-xs text-zinc-400 shrink-0 hidden sm:block">
                {new Date(folder.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
