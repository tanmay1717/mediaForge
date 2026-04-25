'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import Link from 'next/link';
import api from '@/lib/api-client';
import { Images, HardDrive, Folder, Zap, Upload, Settings } from 'lucide-react';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export default function DashboardPage() {
  const { name } = useAuth();
  const cdnDomain = process.env.NEXT_PUBLIC_CDN_DOMAIN || 'cdn.tanmayshetty.com';
  const [stats, setStats] = useState({ totalAssets: 0, totalStorage: 0, totalFolders: 0 });

  useEffect(() => {
    api.get('/v1/stats')
      .then(res => { const data = res.data?.data || res.data; setStats(data); })
      .catch(() => {});
  }, []);

  const statCards = [
    { label: 'Total Assets', value: stats.totalAssets.toString(), icon: Images },
    { label: 'Storage Used', value: formatBytes(stats.totalStorage), icon: HardDrive },
    { label: 'Folders', value: stats.totalFolders.toString(), icon: Folder },
    { label: 'CDN Domain', value: cdnDomain.split('.')[0], icon: Zap },
  ];

  const quickLinks = [
    { href: '/upload', label: 'Upload files', desc: 'Add new media to your library', icon: Upload },
    { href: '/assets', label: 'Browse library', desc: 'View and search all your assets', icon: Images },
    { href: '/folders', label: 'Manage folders', desc: 'Organise assets into folders', icon: Folder },
    { href: '/settings/general', label: 'Settings', desc: 'Account and domain config', icon: Settings },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Welcome back, <span className="font-medium text-zinc-900 dark:text-zinc-100">{name}</span>
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{label}</span>
              <div className="size-7 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
                <Icon className="size-3.5 text-zinc-400 dark:text-zinc-500" />
              </div>
            </div>
            <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{value}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wide mb-3">Quick actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {quickLinks.map(({ href, label, desc, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="card p-4 hover:shadow-md transition-shadow group"
            >
              <div className="size-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center mb-3">
                <Icon className="size-4 text-zinc-400 dark:text-zinc-500" />
              </div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{label}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
