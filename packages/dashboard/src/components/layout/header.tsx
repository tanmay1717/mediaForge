'use client';
import React from 'react';

/**
 * TODO: Top header bar
 * - Search input (Cmd+K to focus, debounced, searches assets globally)
 * - Breadcrumbs component for current path
 * - Notification bell (future)
 * - User avatar dropdown: profile, settings, logout
 */
export default function Header() {
  return (
    <header className="h-14 border-b bg-white flex items-center justify-between px-6">
      <div>{/* TODO: Search input */}</div>
      <div>{/* TODO: User menu */}</div>
    </header>
  );
}
