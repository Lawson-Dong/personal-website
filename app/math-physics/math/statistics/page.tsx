import Link from 'next/link';

export const metadata = {
  title: 'Statistics',
  description: 'Statistics notes, starting with Bessel’s Correction.',
};

const besselCorrection = 'https://github.com/Lawson-Dong/personal-website/blob/main/notes/statistics/bessels-correction.pdf';

export default function Statistics() {
  return (
    <main className="section shell science-room">
      <nav className="science-breadcrumb" aria-label="Breadcrumb">
        <Link href="/math-physics">Math &amp; Physics</Link><span>/</span>
        <Link href="/math-physics/math">Math</Link><span>/</span><span>Statistics</span>
      </nav>
      <p className="eyebrow">MATH / STATISTICS</p>
      <h1 className="portal-title"><em>Statistics.</em></h1>
      <p className="portal-copy">Notes on probability, estimation, and making sense of data.</p>
      <a className="portal-card" href={besselCorrection} target="_blank" rel="noopener noreferrer">
        <span className="eyebrow">01 / STATISTICS NOTE · PDF</span>
        <h2>Bessel’s Correction</h2>
        <p>Notes on sample variance and Bessel’s Correction.</p>
        <span className="portal-card-link">Open PDF on GitHub ↗</span>
      </a>
    </main>
  );
}
