'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import {
  Zap,
  LayoutDashboard,
  Images,
  Upload,
  Folder,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/assets', label: 'Media Library', icon: Images },
  { href: '/upload', label: 'Upload', icon: Upload },
  { href: '/folders', label: 'Folders', icon: Folder },
  { href: '/settings/general', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { name, email, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      'bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 h-full flex flex-col transition-all duration-200',
      collapsed ? 'w-14' : 'w-56'
    )}>
      <div className="h-14 flex items-center px-4 border-b border-zinc-100 dark:border-zinc-800">
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <Zap className="size-5 shrink-0 text-zinc-900 dark:text-zinc-100" />
          {!collapsed && <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate">MediaForge</span>}
        </Link>
      </div>

      <nav className="flex-1 p-2 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                'flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100'
              )}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-zinc-100 dark:border-zinc-800 space-y-0.5">
        {!collapsed && (
          <div className="px-2.5 py-2 mb-1">
            <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate">{name}</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">{email}</p>
          </div>
        )}
        <button
          onClick={logout}
          title={collapsed ? 'Sign out' : undefined}
          className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm text-zinc-500 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <LogOut className="size-4 shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
        >
          {collapsed
            ? <ChevronRight className="size-4 shrink-0" />
            : <><ChevronLeft className="size-4 shrink-0" /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
