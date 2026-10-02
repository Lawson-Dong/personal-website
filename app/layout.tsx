import type { Metadata } from 'next';
import 'katex/dist/katex.min.css';
import './globals.css';
import { ThemeProvider } from '@/components/theme';
import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';
import './portal.css';

export const metadata: Metadata = {
  title: { default: 'Lawson Dong — Physics & Cognitive Science', template: '%s — Lawson Dong' },
  description: 'Research notebook of Lawson Dong, an undergraduate studying physics and cognitive science at UC San Diego. Exploring neural representations, learning dynamics, and AI.',
  openGraph: { title: 'Lawson Dong — Physics & Cognitive Science', description: 'An evolving research notebook on intelligence and its internal mechanisms.', type: 'website' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body><ThemeProvider><Header /><Sidebar /><div className="notebook-content">{children}</div></ThemeProvider></body></html>;
}
