import Link from 'next/link';

export const metadata = { title: 'Machine Learning & Cognitive Science' };

export default function MachineLearningCognitiveScience() {
  return (
    <main className="section shell science-room">
      <p className="eyebrow">05 / LEARNING &amp; MINDS</p>
      <h1 className="portal-title">Machine Learning<br/>&amp; <em>Cognitive Science.</em></h1>
      <p className="portal-copy">Exploring how systems learn, represent information, and make sense of the world.</p>
      <div className="science-folders">
        <section className="science-folder blue-folder">
          <span className="folder-top">01 / MACHINE LEARNING</span>
          <h2>Learning &amp; representation</h2>
          <p>Questions about neural networks, learning dynamics, and the geometry of internal representations.</p>
          <Link className="text-link" href="/research">Explore related experiments ↗</Link>
        </section>
        <section className="science-folder coral-folder">
          <span className="folder-top">02 / COGNITIVE SCIENCE</span>
          <h2>Mind &amp; mechanisms</h2>
          <p>A space for notes on perception, cognition, and connections between biological and artificial intelligence.</p>
          <span className="folder-bottom">Notes to come</span>
        </section>
      </div>
      <Link className="text-link" href="/">Back to the notebook ↗</Link>
    </main>
  );
}
