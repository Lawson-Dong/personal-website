'use client';
import Link from 'next/link';
import { useTheme } from './theme';
export function Header() {
  const { night, toggle } = useTheme();
  return <header className="site-header"><div className="header-inner"><Link className="wordmark" href="/">LAWSON DONG<span className="mark"> / </span> <span className="wordmark-muted">RESEARCH NOTEBOOK</span></Link><nav aria-label="Main navigation"><Link href="/#research">Research</Link><Link href="/#notes">Notes</Link><Link href="/#about">About</Link><button className="mode-toggle" type="button" onClick={toggle} aria-label={night ? 'Switch to paper mode' : 'Switch to night mode'} title={night ? 'Paper mode' : 'Night mode'} aria-pressed={night}>{night ? '☼' : '☾'}</button></nav></div></header>;
}
