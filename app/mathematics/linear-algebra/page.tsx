import Link from 'next/link';
import { ColumnSpaceLab } from '@/components/column-space-lab';
import { RowSpaceLab } from '@/components/row-space-lab';
import { RowLab } from '@/components/row-lab';
import './linear-algebra.css';

export const metadata = { title: 'Linear Algebra Visualizations — Lawson Dong', description: 'Interactive visualizations of Gaussian elimination, elementary row operations, column space, consistency, row space, and null space.' };

export default function LinearAlgebra() {
  return <main className="la-page shell">
    <div className="la-breadcrumb"><Link href="/#notes">Notes</Link><span>/</span><span>Mathematics</span><span>/</span><span>Linear Algebra</span></div>
    <div className="la-intro"><span className="eyebrow">MATHEMATICS / VISUAL NOTES</span><h1>Linear <em>Algebra.</em></h1><p>This corner of the notebook is mainly for interactive visualizations. Move through the operations and watch the matrix, equations, and geometry describe the same system.</p></div>
    <nav className="la-index" aria-label="Linear algebra visualizations"><a href="#gaussian-elimination"><span>01 / VISUALIZATION</span><strong>Gaussian Elimination</strong><small>Follow the purposeful sequence of row operations.</small></a><a href="#elementary-row-operations"><span>02 / VISUALIZATION</span><strong>Elementary Row Operations</strong><small>Explore the three allowed moves one at a time.</small></a><a href="#column-space"><span>03 / VISUALIZATION</span><strong>Column Space &amp; Consistency</strong><small>Explore linear combinations and solve Ax = b.</small></a><a href="#row-space"><span>04 / VISUALIZATION</span><strong>Row Space &amp; Null Space</strong><small>Combine rows and explore perpendicular null vectors.</small></a></nav>
    <RowLab />
    <ColumnSpaceLab />
    <RowSpaceLab />
    <section className="la-reading" aria-labelledby="la-why"><span className="eyebrow">HOW THEY FIT TOGETHER</span><h2 id="la-why">The moves and <em>the strategy.</em></h2><div className="la-reading-grid"><p>Each row of an augmented matrix is an equation. Swapping rows changes their order; scaling a row by a nonzero number rewrites the same equation; replacing a row by itself plus a multiple of another produces an equivalent system.</p><p>Gaussian elimination uses those three moves with a particular aim: choose a pivot and make the entries beneath it zero. Gauss–Jordan elimination continues by clearing above the pivots.</p></div><div className="la-equivalence"><span>Allowed moves</span><strong>Elementary row operations</strong><span>Strategy for creating zeros</span><strong>Gaussian elimination</strong></div></section>
  </main>;
}
