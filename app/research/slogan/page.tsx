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
      <div className="slogan-list">
        <blockquote>
          <p>Correlation does not imply causation.</p>
        </blockquote>
        <blockquote>
          <p><strong>Learn patterns from the training set and validate their generalization on a held-out set. When a pattern holds on unseen data, that is evidence of a generalizable principle rather than mere overfitting.</strong></p>
        </blockquote>
      </div>
    </main>
  );
}
