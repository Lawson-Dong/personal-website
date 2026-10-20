import Link from 'next/link';
import { Folder, ArrowUpRight } from 'lucide-react';

export const metadata = { title: 'Physics' };

export default function PhysicsFolder() {
  return (
    <main className="section shell science-room physics-room">
      <nav className="science-breadcrumb" aria-label="Breadcrumb">
        <Link href="/math-physics">Math &amp; Physics</Link><span>/</span><span>Physics</span>
      </nav>
      <p className="eyebrow">02 / THE PHYSICS FOLDER</p>
      <h1 className="portal-title">Physics.<br/><em>Stay curious.</em></h1>
      <p className="portal-copy">Notes on the patterns and principles behind the physical world.</p>
      <div className="science-folders">
        <Link className="science-folder blue-folder" href="/math-physics/physics/statistical-mechanics">
          <span className="folder-top"><Folder aria-hidden="true"/><span>01 / STATISTICAL MECHANICS</span><ArrowUpRight aria-hidden="true"/></span>
          <h2>Statistical Mechanics</h2>
          <p>Handwritten lecture notes on statistical mechanics.</p>
          <span className="folder-bottom">Stanford Opencourse <span aria-hidden="true">→</span></span>
        </Link>
      </div>
    </main>
  );
}
