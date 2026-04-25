'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/providers/theme-provider';
import { Sun, Moon, Globe } from 'lucide-react';

const titleMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/assets': 'Media Library',
  '/upload': 'Upload',
  '/folders': 'Folders',
  '/settings': 'Settings',
};

export default function Header() {
  const pathname = usePathname();
  const title = Object.entries(titleMap).find(([path]) => pathname.startsWith(path))?.[1] || 'MediaForge';
  const { theme, toggle } = useTheme();

  return (
    <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between px-6">
      <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</h1>
      <div className="flex items-center gap-3">
        {process.env.NEXT_PUBLIC_CDN_DOMAIN && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
            <Globe className="size-3.5" />
            <span>{process.env.NEXT_PUBLIC_CDN_DOMAIN}</span>
          </div>
        )}
        <button
          onClick={toggle}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="size-8 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
        >
          {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
      </div>
    </header>
  );
}
