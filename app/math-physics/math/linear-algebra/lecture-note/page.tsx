import Link from 'next/link';

export const metadata = {
  title: 'Linear Algebra — Lecture Note',
  description: 'Handwritten linear algebra notes: Lecture 7 on transformations, Lecture 8 on standard matrices and mappings, Lecture 9 on matrix operations, powers, and transposes, Lecture 10 on matrix inverses and invertible transformations, Lecture 11 on vector spaces, subspaces, and spans, and Lecture 13 on null, column, and row spaces and the kernel and range of linear transformations.',
};

const lecture7 = 'https://github.com/Lawson-Dong/personal-website/blob/main/notes/linear-algebra/lecture-7.pdf';
const lecture8 = 'https://github.com/Lawson-Dong/personal-website/blob/main/notes/linear-algebra/lecture-8.pdf';

const lecture9 = 'https://github.com/Lawson-Dong/personal-website/blob/main/notes/linear-algebra/lecture-9.pdf';

const lecture10 = 'https://github.com/Lawson-Dong/personal-website/blob/main/notes/linear-algebra/lecture-10.pdf';

const lecture11 = 'https://github.com/Lawson-Dong/personal-website/blob/main/notes/linear-algebra/lecture-11.pdf';

const lecture13 = 'https://github.com/Lawson-Dong/personal-website/blob/main/notes/linear-algebra/lecture-13.pdf';

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
      <a className="portal-card" href={lecture8} target="_blank" rel="noopener noreferrer">
        <span className="eyebrow">08 / LECTURE NOTE · PDF</span>
        <h2>Lecture 8</h2>
        <p>Standard matrices of linear transformations, geometric examples, and one-to-one and onto mappings.</p>
        <span className="portal-card-link">Open PDF on GitHub ↗</span>
      </a>
      <a className="portal-card" href={lecture9} target="_blank" rel="noopener noreferrer">
        <span className="eyebrow">09 / LECTURE NOTE · PDF</span>
        <h2>Lecture 9</h2>
        <p>Diagonal and zero matrices, matrix addition and multiplication, scalar multiplication, powers, and transposes.</p>
        <span className="portal-card-link">Open PDF on GitHub ↗</span>
      </a>
      <a className="portal-card" href={lecture10} target="_blank" rel="noopener noreferrer">
        <span className="eyebrow">10 / LECTURE NOTE · PDF</span>
        <h2>Lecture 10</h2>
        <p>Matrix inverses, inverse properties, row reduction, and invertible linear transformations.</p>
        <span className="portal-card-link">Open PDF on GitHub ↗</span>
      </a>
      <a className="portal-card" href={lecture11} target="_blank" rel="noopener noreferrer">
        <span className="eyebrow">11 / LECTURE NOTE · PDF</span>
        <h2>Lecture 11</h2>
        <p>Vector spaces, subspaces, spans, and generating sets.</p>
        <span className="portal-card-link">Open PDF on GitHub ↗</span>
      </a>
      <a className="portal-card" href={lecture13} target="_blank" rel="noopener noreferrer">
        <span className="eyebrow">13 / LECTURE NOTE · PDF</span>
        <h2>Lecture 13</h2>
        <p>Null, column, and row spaces, and the kernel and range of linear transformations.</p>
        <span className="portal-card-link">Open PDF on GitHub ↗</span>
      </a>
    </main>
  );
}
