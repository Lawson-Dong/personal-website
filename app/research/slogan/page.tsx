import Link from 'next/link';
import './slogan.css';

export const metadata = {
  title: 'Research Slogan',
  description: 'Reminders on correlation, causation, and generalization.',
};

export default function ResearchSlogan() {
  return (
    <main className="shell research-slogan">
      <Link className="text-link" href="/research">Back to Research</Link>
      <header>
        <p className="eyebrow">RESEARCH / GUIDING PRINCIPLES</p>
        <h1>Research Slogan</h1>
      </header>
      <ol className="slogan-list" role="list">
        <li>
          <span className="slogan-number" aria-hidden="true">01</span>
          <blockquote>
            <p>Correlation does not imply causation.</p>
          </blockquote>
        </li>
        <li className="slogan-generalization">
          <span className="slogan-number" aria-hidden="true">02</span>
          <blockquote>
            <p>Learn patterns from the training set and validate their generalization on a <span className="slogan-shimmer">held-out set</span>. When a pattern holds on <span className="slogan-shimmer">unseen data</span>, that is evidence of a generalizable principle rather than mere overfitting.</p>
          </blockquote>
        </li>
      </ol>
    </main>
  );
}
