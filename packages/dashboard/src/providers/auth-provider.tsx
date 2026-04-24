'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import * as cognito from '@/lib/cognito';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  email: string | null;
  name: string | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<string>;
  confirmSignup: (email: string, code: string) => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<CognitoUserSession | null>(null);

  useEffect(() => {
    cognito.getSession()
      .then(s => setSession(s))
      .catch(() => setSession(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const s = await cognito.signIn(email, password);
    setSession(s);
  }, []);

  const logout = useCallback(() => {
    cognito.signOut();
    setSession(null);
  }, []);

  const refreshSession = useCallback(async () => {
    const s = await cognito.getSession();
    setSession(s);
  }, []);

  const value: AuthState = {
    isAuthenticated: !!session?.isValid(),
    isLoading,
    userId: session?.getIdToken().payload.sub ?? null,
    email: session?.getIdToken().payload.email ?? null,
    name: session?.getIdToken().payload.name ?? null,
    accessToken: session?.getAccessToken().getJwtToken() ?? null,
    login,
    logout,
    signup: cognito.signUp,
    confirmSignup: cognito.confirmSignUp,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
