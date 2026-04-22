'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { getSession, signIn, signOut as cognitoSignOut, signUp, confirmSignUp } from '@/lib/cognito';

/**
 * Auth context — manages Cognito session state across the dashboard.
 *
 * TODO:
 * - On mount: check for existing session (user refreshes the page)
 * - Provide: user info, isAuthenticated, isLoading
 * - Provide: login, logout, signup, confirmSignup functions
 * - On logout: clear session + redirect to /login
 * - On token expiry: auto-refresh using refresh token
 */
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  email: string | null;
  name: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<string>;
  confirmSignup: (email: string, code: string) => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<CognitoUserSession | null>(null);

  useEffect(() => {
    getSession().then(s => { setSession(s); setIsLoading(false); });
  }, []);

  const login = async (email: string, password: string) => {
    const s = await signIn(email, password);
    setSession(s);
  };

  const logout = () => {
    cognitoSignOut();
    setSession(null);
  };

  const value: AuthState = {
    isAuthenticated: !!session?.isValid(),
    isLoading,
    userId: session?.getIdToken().payload.sub ?? null,
    email: session?.getIdToken().payload.email ?? null,
    name: session?.getIdToken().payload.name ?? null,
    login, logout,
    signup: signUp,
    confirmSignup: confirmSignUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
