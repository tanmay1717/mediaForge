'use client';
import React from 'react';
import { useAuth } from '@/providers/auth-provider';
import { Globe, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function GeneralSettingsPage() {
  const { name, email, userId } = useAuth();
  const cdnDomain = process.env.NEXT_PUBLIC_CDN_DOMAIN || 'cdn.tanmayshetty.com';

  return (
    <div className="max-w-xl space-y-4">
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="size-4 text-zinc-400" />
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Delivery Domain</h3>
        </div>
        <div className="flex items-center gap-3">
          <code className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 px-3 py-2 rounded-lg text-xs text-zinc-700 dark:text-zinc-300">
            {cdnDomain}
          </code>
          <Badge variant="success">Active</Badge>
        </div>
        <p className="text-xs text-zinc-400 mt-2">All assets are served from this domain</p>
      </div>

      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <User className="size-4 text-zinc-400" />
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Account</h3>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Name', value: name },
            { label: 'Email', value: email },
            { label: 'User ID', value: userId, mono: true },
          ].map(({ label, value, mono }) => (
            <div key={label}>
              <p className="text-xs text-zinc-400 mb-0.5">{label}</p>
              <p className={`text-sm ${mono ? 'font-mono text-xs text-zinc-400' : 'font-medium text-zinc-900 dark:text-zinc-100'}`}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
