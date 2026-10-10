import Link from 'next/link';
import { ArrowUpRight, BookOpen, Shapes } from 'lucide-react';

export const metadata = {
  title: 'Linear Algebra',
  description: 'Explore linear algebra through fun visualizations and lecture notes.',
};

export default function LinearAlgebra() {
  return (
    <main className="section shell science-room">
      <nav className="science-breadcrumb" aria-label="Breadcrumb">
        <Link href="/math-physics">Math &amp; Physics</Link><span>/</span>
        <Link href="/math-physics/math">Math</Link><span>/</span><span>Linear Algebra</span>
      </nav>
      <p className="eyebrow">MATHEMATICS / LINEAR ALGEBRA</p>
      <h1 className="portal-title">Linear <em>Algebra.</em></h1>
      <p className="portal-copy">Explore the ideas in motion, or open the notes from class.</p>
      <div className="science-folders">
        <Link className="science-folder blue-folder" href="/math-physics/math/linear-algebra/fun-visualization">
          <span className="folder-top"><Shapes aria-hidden="true"/><span>01 / VISUALIZATION</span><ArrowUpRight aria-hidden="true"/></span>
          <h2>Fun Visualization</h2>
          <p>Gaussian elimination, elementary row operations, and column space &amp; consistency.</p>
          <span className="folder-bottom">3 interactive visualizations <span aria-hidden="true">→</span></span>
        </Link>
        <Link className="science-folder coral-folder" href="/math-physics/math/linear-algebra/lecture-note">
          <span className="folder-top"><BookOpen aria-hidden="true"/><span>02 / LECTURE NOTES</span><ArrowUpRight aria-hidden="true"/></span>
          <h2>Lecture Note</h2>
          <p>Notes from class, collected as PDFs for reading and review.</p>
          <span className="folder-bottom">Lecture 7 <span aria-hidden="true">→</span></span>
        </Link>
      </div>
    </main>
  );
}
