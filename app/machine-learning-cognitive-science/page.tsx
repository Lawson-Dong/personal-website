import Link from 'next/link';

export const metadata = { title: 'Machine Learning & Cognitive Science' };

export default function MachineLearningCognitiveScience() {
  return (
    <main className="section shell science-room">
      <p className="eyebrow">05 / LEARNING &amp; MINDS</p>
      <h1 className="portal-title">Machine Learning<br/>&amp; <em>Cognitive Science.</em></h1>
      <Link className="text-link" href="/">Back to the notebook ↗</Link>
    </main>
  );
}
