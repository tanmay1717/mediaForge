'use client';
import React from 'react';
import { useAuth } from '@/providers/auth-provider';

export default function GeneralSettingsPage() {
  const { name, email, userId } = useAuth();
  const cdnDomain = process.env.NEXT_PUBLIC_CDN_DOMAIN || 'cdn.tanmayshetty.com';

  return (
    <div className="max-w-2xl">
      <div className="card p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Delivery Domain</h3>
        <div className="flex items-center gap-3">
          <code className="flex-1 bg-gray-50 px-4 py-2 rounded-lg text-sm">{cdnDomain}</code>
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Active</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">All your assets are served from this domain</p>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Account</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500">Name</label>
            <p className="text-sm font-medium">{name}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500">Email</label>
            <p className="text-sm font-medium">{email}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500">User ID</label>
            <p className="text-sm font-mono text-gray-400">{userId}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
