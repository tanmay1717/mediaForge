'use client';
import React from 'react';
import { usePathname } from 'next/navigation';

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

  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold">{title}</h1>
      <span className="text-xs text-gray-400">{process.env.NEXT_PUBLIC_CDN_DOMAIN}</span>
    </header>
  );
}
