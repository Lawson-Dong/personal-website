'use client';
import Link from 'next/link';
import { Mail, Sparkles } from 'lucide-react';
import { useTheme } from './theme';
export function Header() {
 const {night,toggle}=useTheme();
 return <header className="site-header"><div className="header-inner"><Link className="wordmark" href="/">LAWSON DONG<span className="mark"> / </span><span className="wordmark-muted">FIELD NOTES</span></Link><nav aria-label="Main navigation"><Link className="message-link" href="/message"><span className="mail-orbit" aria-hidden="true"><Mail size={17}/><Sparkles className="mail-spark" size={12}/></span><span>Leave me a message</span></Link><button className="mode-toggle" type="button" onClick={toggle} aria-label={night?'Switch to paper mode':'Switch to night mode'} aria-pressed={night}>{night?'☼':'☾'}</button></nav></div></header>;
}
