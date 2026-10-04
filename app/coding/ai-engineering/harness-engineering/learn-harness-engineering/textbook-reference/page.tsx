import Link from 'next/link';

export const metadata = {
  title: 'Textbook / Reference — Learn Harness Engineering',
  description: 'The Walking Labs Learn Harness Engineering course reference.',
};

export default function TextbookReference() {
  return (
    <main className="section shell ch-page">
      <nav className="ch-crumb" aria-label="Breadcrumb">
        <Link href="/coding/ai-engineering">AI Engineering</Link> /{' '}
        <Link href="/coding/ai-engineering/harness-engineering">Harness Engineering</Link> /{' '}
        <Link href="/coding/ai-engineering/harness-engineering/learn-harness-engineering">Learn Harness Engineering</Link> / Textbook / Reference
      </nav>
      <p className="ch-kicker">CHAPTER 01 / COURSE REFERENCE</p>
      <h1>Textbook /<br /><em>Reference.</em></h1>
      <p className="ch-lead">The course reference for this learning notebook.</p>
      <a className="ch-feature" href="https://github.com/walkinglabs/learn-harness-engineering" target="_blank" rel="noopener noreferrer">
        <div>
          <p className="ch-kicker">WALKING LABS / GITHUB</p>
          <h2>Learn Harness Engineering</h2>
          <p>A project-based course on the environment, state management, verification and control mechanisms around AI coding agents.</p>
          <span className="ch-open">Open the textbook on GitHub ↗</span>
        </div>
        <div className="ch-feature-art" aria-hidden="true">
          <span>LECTURES</span><span>PROJECTS</span><span>REFERENCE MATERIALS</span>
        </div>
      </a>
      <Link className="ch-open" href="/coding/ai-engineering/harness-engineering/learn-harness-engineering">← Back to chapters</Link>
    </main>
  );
}
