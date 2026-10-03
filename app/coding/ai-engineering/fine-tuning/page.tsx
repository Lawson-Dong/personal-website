import Link from 'next/link';

export const metadata = {
  title: 'Fine-tuning',
  description: 'Lawson’s fine-tuning notes: dataset analysis, sequence length and practical training decisions.',
};

export default function FineTuning() {
  return (
    <main className="section shell ch-page">
      <nav className="ch-crumb" aria-label="Breadcrumb">
        <Link href="/coding">Coding</Link> /{' '}
        <Link href="/coding/ai-engineering">AI Engineering</Link> / Fine-tuning
      </nav>
      <p className="ch-kicker">FINE-TUNING / FIELD NOTES</p>
      <h1>Fine-<em>tuning.</em></h1>
      <p className="ch-lead">Practical experiments connecting training data to model configuration.</p>
      <a
        className="ch-feature"
        href="https://blog.csdn.net/2604_95769709/article/details/163394951"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div>
          <p className="ch-kicker">01 / ORIGINAL ARTICLE · CHINESE · CSDN</p>
          <h2>Code Alpaca: Why Sequence Length = 2048?</h2>
          <p>An analysis of Code Alpaca token lengths and the reasoning behind a 2048-token training limit, with experiment code.</p>
          <p className="ch-kicker">LLM · FINE-TUNING · DATASET ANALYSIS</p>
          <span className="ch-open">Read my article on CSDN ↗</span>
        </div>
        <div className="ch-feature-art" aria-hidden="true">
          <span>CODE ALPACA</span><span>TOKEN LENGTH → TRAINING LIMIT</span><span>2048 TOKENS</span>
        </div>
      </a>
    </main>
  );
}
