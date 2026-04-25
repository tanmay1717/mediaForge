'use client';
import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { AlertCircle } from 'lucide-react';

function VerifyForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { confirmSignup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await confirmSignup(email, code);
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-base font-semibold text-zinc-900 mb-1">Check your email</h2>
      <p className="text-xs text-zinc-500 mb-5">
        We sent a 6-digit code to <span className="font-medium text-zinc-700">{email}</span>
      </p>

      {error && (
        <div className="mb-4 flex items-start gap-2 p-3 bg-red-50 border border-red-100 text-red-700 text-xs rounded-lg">
          <AlertCircle className="size-3.5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          className="input-field text-center text-2xl tracking-[0.5em] font-mono"
          placeholder="000000"
          maxLength={6}
          required
          autoFocus
        />
        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="btn-primary w-full justify-center"
        >
          {loading ? 'Verifying...' : 'Verify email'}
        </button>
      </form>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-zinc-300 border-t-zinc-900" />
      </div>
    }>
      <VerifyForm />
    </Suspense>
  );
}
