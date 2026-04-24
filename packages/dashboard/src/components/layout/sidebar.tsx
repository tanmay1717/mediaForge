'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/assets', label: 'Media Library', icon: '🖼️' },
  { href: '/upload', label: 'Upload', icon: '📤' },
  { href: '/folders', label: 'Folders', icon: '📁' },
  { href: '/settings/general', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { name, email, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 h-full flex flex-col transition-all duration-200`}>
      <div className="p-4 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          {!collapsed && <span className="font-bold text-lg">MediaForge</span>}
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => {
          const active = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
              <span>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-gray-100">
        {!collapsed && (
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium truncate">{name}</p>
            <p className="text-xs text-gray-500 truncate">{email}</p>
          </div>
        )}
        <button onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors">
          <span>🚪</span>
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
      <button onClick={() => setCollapsed(!collapsed)}
        className="p-3 border-t border-gray-100 text-xs text-gray-400 hover:text-gray-600">
        {collapsed ? '→' : '← Collapse'}
      </button>
    </aside>
  );
}
