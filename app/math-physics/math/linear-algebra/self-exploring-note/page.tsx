import Link from 'next/link';

export const metadata = {
  title: 'Linear Algebra — Self-exploring Note',
  description: 'Independent linear algebra explorations: covariance and covariance matrices.',
};

const covarianceMatrix = 'https://github.com/Lawson-Dong/personal-website/blob/main/notes/linear-algebra/self-exploring/covariance-matrix.pdf';

export default function SelfExploringNote() {
  return (
    <main className="section shell science-room">
      <nav className="science-breadcrumb" aria-label="Breadcrumb">
        <Link href="/math-physics">Math &amp; Physics</Link><span>/</span>
        <Link href="/math-physics/math">Math</Link><span>/</span>
        <Link href="/math-physics/math/linear-algebra">Linear Algebra</Link><span>/</span><span>Self-exploring Note</span>
      </nav>
      <p className="eyebrow">LINEAR ALGEBRA / SELF-EXPLORING NOTES</p>
      <h1 className="portal-title">Self-exploring <em>Note.</em></h1>
      <p className="portal-copy">Independent explorations, ready to revisit.</p>
      <a className="portal-card" href={covarianceMatrix} target="_blank" rel="noopener noreferrer">
        <span className="eyebrow">01 / SELF-EXPLORING NOTE · PDF</span>
        <h2>Covariance Matrix</h2>
        <p>Notes on covariance and covariance matrices.</p>
        <span className="portal-card-link">Open PDF on GitHub ↗</span>
      </a>
    </main>
  );
}
