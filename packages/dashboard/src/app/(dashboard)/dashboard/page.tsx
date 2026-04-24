'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import Link from 'next/link';
import api from '@/lib/api-client';

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

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Welcome back, {name} 👋</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Assets', value: stats.totalAssets.toString(), icon: '🖼️' },
          { label: 'Storage Used', value: formatBytes(stats.totalStorage), icon: '💾' },
          { label: 'Folders', value: stats.totalFolders.toString(), icon: '📁' },
          { label: 'CDN Domain', value: cdnDomain.split('.')[0], icon: '⚡' },
        ].map(stat => (
          <div key={stat.label} className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">{stat.label}</span>
              <span className="text-xl">{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-3">Quick Upload</h3>
          <p className="text-sm text-gray-500 mb-4">Drag and drop files or click to upload</p>
          <Link href="/upload" className="btn-primary inline-block">Go to Upload</Link>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-3">Your CDN Domain</h3>
          <p className="text-sm text-gray-500 mb-2">Transform images on the fly:</p>
          <code className="block bg-gray-100 p-3 rounded-lg text-xs break-all">
            https://{cdnDomain}/v1/image/w_500,f_auto,q_auto/products/hero.jpg
          </code>
        </div>
      </div>
    </div>
  );
}
