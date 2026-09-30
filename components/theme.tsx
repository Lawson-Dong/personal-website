'use client';
import { createContext, useContext, useEffect, useState } from 'react';
type ThemeContextValue = { night: boolean; toggle: () => void };
const ThemeContext = createContext<ThemeContextValue>({ night: false, toggle: () => {} });
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [night, setNight] = useState(false);
  useEffect(() => { const saved = localStorage.getItem('lawson-theme'); if (saved === 'night') setNight(true); }, []);
  useEffect(() => { document.documentElement.dataset.theme = night ? 'night' : 'paper'; localStorage.setItem('lawson-theme', night ? 'night' : 'paper'); }, [night]);
  return <ThemeContext.Provider value={{ night, toggle: () => setNight(v => !v) }}>{children}</ThemeContext.Provider>;
}
export const useTheme = () => useContext(ThemeContext);
