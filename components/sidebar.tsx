'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

  if (pathname !== '/') return null;

  return (
    <aside className="notebook-sidebar">
      <Link className="sidebar-home" href="/">Lawson’s<br/><em>field notes.</em></Link>
      <blockquote className="sidebar-quote">
        The deeper we seek, the more is our wonder excited.
      </blockquote>
      <div className="sidebar-foot">
        <span>PHYSICS × INTELLIGENCE</span>
        <p>Learning, experimenting,<br/>and making things.</p>
        <Link href="/lost">A quieter corner ♪</Link>
      </div>
    </aside>
  );
}
