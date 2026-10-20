import Link from 'next/link';

export const metadata = {
  title: 'Stanford Opencourse — Statistical Mechanics',
  description: 'Handwritten Stanford Statistical Mechanics notes for Lecture 2 and Lecture 3.',
};

const lectures = [
  { number: 2, pages: 3, url: 'https://github.com/Lawson-Dong/personal-website/blob/main/notes/statistical-mechanics/stanford-opencourse/lecture-2.pdf' },
  { number: 3, pages: 7, url: 'https://github.com/Lawson-Dong/personal-website/blob/main/notes/statistical-mechanics/stanford-opencourse/lecture-3.pdf' },
];

export default function StanfordOpencourse() {
  return (
    <main className="section shell science-room">
      <nav className="science-breadcrumb" aria-label="Breadcrumb">
        <Link href="/math-physics">Math &amp; Physics</Link><span>/</span>
        <Link href="/math-physics/physics">Physics</Link><span>/</span>
        <Link href="/math-physics/physics/statistical-mechanics">Statistical Mechanics</Link><span>/</span><span>Stanford Opencourse</span>
      </nav>
      <p className="eyebrow">STATISTICAL MECHANICS / STANFORD OPENCOURSE</p>
      <h1 className="portal-title">Stanford <em>Opencourse.</em></h1>
      <p className="portal-copy">Handwritten lecture notes for reading and review.</p>
      <div className="science-folders">
        {lectures.map((lecture) => (
          <a key={lecture.number} className="portal-card" href={lecture.url} target="_blank" rel="noopener noreferrer">
            <span className="eyebrow">LECTURE NOTE · PDF · {lecture.pages} PAGES</span>
            <h2>Lecture {lecture.number}</h2>
            <p>Stanford Statistical Mechanics — handwritten notes.</p>
            <span className="portal-card-link">Open PDF on GitHub ↗</span>
          </a>
        ))}
      </div>
    </main>
  );
}
