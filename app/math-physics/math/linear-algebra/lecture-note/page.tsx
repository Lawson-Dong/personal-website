import Link from 'next/link';

export const metadata = {
  title: 'Linear Algebra — Lecture Note',
  description: 'Linear algebra lecture notes: Lecture 7 on transformations and linear transformations.',
};

const lecture7 = 'https://github.com/Lawson-Dong/personal-website/blob/main/notes/linear-algebra/lecture-7.pdf';

export default function LectureNote() {
  return (
    <main className="section shell science-room">
      <nav className="science-breadcrumb" aria-label="Breadcrumb">
        <Link href="/math-physics">Math &amp; Physics</Link><span>/</span>
        <Link href="/math-physics/math">Math</Link><span>/</span>
        <Link href="/math-physics/math/linear-algebra">Linear Algebra</Link><span>/</span><span>Lecture Note</span>
      </nav>
      <p className="eyebrow">LINEAR ALGEBRA / LECTURE NOTES</p>
      <h1 className="portal-title">Lecture <em>Note.</em></h1>
      <p className="portal-copy">Notes from class, ready to revisit.</p>
      <a className="portal-card" href={lecture7} target="_blank" rel="noopener noreferrer">
        <span className="eyebrow">07 / LECTURE NOTE · PDF</span>
        <h2>Lecture 7</h2>
        <p>Transformations, matrix transformations, and linear transformations.</p>
        <span className="portal-card-link">Open PDF on GitHub ↗</span>
      </a>
    </main>
  );
}
