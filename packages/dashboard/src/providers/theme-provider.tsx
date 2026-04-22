'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * TODO:
 * - Detect system preference with matchMedia('(prefers-color-scheme: dark)')
 * - Toggle between light/dark by adding/removing 'dark' class on <html>
 * - Persist preference in cookie (not localStorage — SSR compatibility)
 */
type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeState>({ theme: 'system', setTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    // TODO: Apply theme class to document.documentElement
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
