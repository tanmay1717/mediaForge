'use client';
import React from 'react';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import AuthGuard from '@/components/auth/auth-guard';

/** Protected dashboard layout — sidebar + header + auth guard */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
