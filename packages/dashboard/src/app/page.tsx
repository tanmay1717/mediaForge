'use client';
import React from 'react';
import { useAuth } from '@/providers/auth-provider';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (typeof window !== 'undefined' && window.location.pathname !== '/login/') {
      window.location.href = '/login/';
      return null;
    }
  }

  if (typeof window !== 'undefined' && window.location.pathname === '/') {
    window.location.href = '/dashboard/';
    return null;
  }

  return null;
}
