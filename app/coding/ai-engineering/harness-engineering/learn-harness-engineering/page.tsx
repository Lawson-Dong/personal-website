import Link from 'next/link';

export const metadata = {
  title: 'Learn Harness Engineering',
  description: 'Course references and learning notes on harness engineering.',
};

export default function LearnHarnessEngineering() {
  return (
    <main className="section shell ch-page">
      <nav className="ch-crumb" aria-label="Breadcrumb">
        <Link href="/coding/ai-engineering">AI Engineering</Link> /{' '}
        <Link href="/coding/ai-engineering/harness-engineering">Harness Engineering</Link> / Learn Harness Engineering
      </nav>
      <p className="ch-kicker">HARNESS ENGINEERING / LEARNING NOTEBOOK</p>
      <h1>Learn Harness<br /><em>Engineering.</em></h1>
      <p className="ch-lead">Start with the course reference, then build an understanding of the systems around an agent.</p>
      <h2 className="ch-index-title">Chapters</h2>
      <div className="ch-chapter-grid">
        <Link className="ch-chapter-card" href="/coding/ai-engineering/harness-engineering/learn-harness-engineering/textbook-reference">
          <span className="ch-number">01</span>
          <div><h3>Textbook / Reference</h3><p>Learn Harness Engineering by Walking Labs.</p></div>
          <span className="ch-card-arrow" aria-hidden="true">↗</span>
        </Link>
      </div>
    </main>
  );
}
