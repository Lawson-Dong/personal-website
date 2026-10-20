import Link from 'next/link';
import { BookOpen, ArrowUpRight } from 'lucide-react';

export const metadata = {
  title: 'Statistical Mechanics',
  description: 'Statistical mechanics notes from Stanford Opencourse.',
};

export default function StatisticalMechanics() {
  return (
    <main className="section shell science-room">
      <nav className="science-breadcrumb" aria-label="Breadcrumb">
        <Link href="/math-physics">Math &amp; Physics</Link><span>/</span>
        <Link href="/math-physics/physics">Physics</Link><span>/</span><span>Statistical Mechanics</span>
      </nav>
      <p className="eyebrow">PHYSICS / STATISTICAL MECHANICS</p>
      <h1 className="portal-title">Statistical <em>Mechanics.</em></h1>
      <p className="portal-copy">From microscopic states to macroscopic patterns.</p>
      <div className="science-folders">
        <Link className="science-folder coral-folder" href="/math-physics/physics/statistical-mechanics/stanford-opencourse">
          <span className="folder-top"><BookOpen aria-hidden="true"/><span>01 / LECTURE NOTES</span><ArrowUpRight aria-hidden="true"/></span>
          <h2>Stanford Opencourse</h2>
          <p>Handwritten notes from Stanford statistical mechanics lectures.</p>
          <span className="folder-bottom">Lecture 2 · Lecture 3 <span aria-hidden="true">→</span></span>
        </Link>
      </div>
    </main>
  );
}
