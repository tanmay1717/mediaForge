'use client';
import React, { useState } from 'react';
import Link from 'next/link';

/**
 * TODO: Collapsible sidebar navigation
 * - Logo at top
 * - Nav links: Dashboard, Media Library, Upload, Folders
 * - Settings link at bottom
 * - Collapse toggle (icon-only mode)
 * - Active link highlighting based on current route
 * - Folder tree shortcut (show top 5 folders)
 * - User avatar + name at bottom with logout dropdown
 */
export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { href: '/assets', label: 'Media Library', icon: 'Image' },
    { href: '/upload', label: 'Upload', icon: 'Upload' },
    { href: '/folders', label: 'Folders', icon: 'FolderOpen' },
    { href: '/settings', label: 'Settings', icon: 'Settings' },
  ];

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-white border-r h-full flex flex-col transition-all`}>
      <div className="p-4 font-bold text-lg">
        {collapsed ? 'MF' : 'MediaForge'}
      </div>
      <nav className="flex-1 p-2">
        {links.map(link => (
          <Link key={link.href} href={link.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-700">
            {/* TODO: Use lucide-react icons */}
            <span>{collapsed ? link.icon[0] : link.label}</span>
          </Link>
        ))}
      </nav>
      <button onClick={() => setCollapsed(!collapsed)} className="p-4 text-xs text-gray-400">
        {collapsed ? '→' : '← Collapse'}
      </button>
    </aside>
  );
}
