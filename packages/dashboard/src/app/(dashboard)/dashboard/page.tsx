'use client';
import React from 'react';
import { useAuth } from '@/providers/auth-provider';
import Link from 'next/link';

export default function DashboardPage() {
  const { name } = useAuth();
  const cdnDomain = process.env.NEXT_PUBLIC_CDN_DOMAIN || 'cdn.tanmayshetty.com';

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Welcome back, {name} 👋</h2>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Assets', value: '—', icon: '🖼️' },
          { label: 'Storage Used', value: '—', icon: '💾' },
          { label: 'CDN Bandwidth', value: '—', icon: '🌐' },
          { label: 'Transforms', value: '—', icon: '⚡' },
        ].map(stat => (
          <div key={stat.label} className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">{stat.label}</span>
              <span className="text-xl">{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-3">Quick Upload</h3>
          <p className="text-sm text-gray-500 mb-4">Drag and drop files or click to upload</p>
          <Link href="/upload" className="btn-primary inline-block">Go to Upload</Link>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-3">Your CDN Domain</h3>
          <p className="text-sm text-gray-500 mb-2">Transform images on the fly:</p>
          <code className="block bg-gray-50 p-3 rounded-lg text-xs text-gray-700 break-all">
            https://{cdnDomain}/v1/image/w_500,f_auto,q_auto/products/hero.jpg
          </code>
        </div>
      </div>
    </div>
  );
}
