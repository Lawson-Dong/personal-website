import Link from 'next/link';

export const metadata = {
  title: 'Harness Engineering',
  description: 'Learning to build the systems around reliable AI agents.',
};

export default function HarnessEngineering() {
  return (
    <main className="section shell ch-page">
      <nav className="ch-crumb" aria-label="Breadcrumb">
        <Link href="/coding">Coding</Link> /{' '}
        <Link href="/coding/ai-engineering">AI Engineering</Link> / Harness Engineering
      </nav>
      <p className="ch-kicker">HARNESS ENGINEERING / LEARNING PATH</p>
      <h1>Harness <em>Engineering.</em></h1>
      <p className="ch-lead">Build the instructions, tools, state and feedback that help an AI agent complete its work.</p>
      <Link className="ch-feature" href="/coding/ai-engineering/harness-engineering/learn-harness-engineering">
        <div>
          <p className="ch-kicker">01 / LEARNING NOTEBOOK</p>
          <h2>Learn Harness Engineering</h2>
          <p>A place for course references and learning notes on agent harness design.</p>
          <span className="ch-open">Open Learn Harness Engineering ↗</span>
        </div>
        <div className="ch-feature-art" aria-hidden="true">
          <span>READ</span><span>BUILD</span><span>VERIFY</span>
        </div>
      </Link>
      <section aria-labelledby="agent-skills-title">
        <p className="ch-kicker">02 / REUSABLE AGENT TOOLS</p>
        <h2 id="agent-skills-title">Agent Skills</h2>
        <a
          className="ch-feature"
          href="https://github.com/Lawson-Dong/agent-skill/tree/High-Dimensional-Vector-Visualization-Excuter"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div>
            <p className="ch-kicker">VECTOR GEOMETRY / VISUALIZATION</p>
            <h3>High Dimensional Vector Visualization Executer</h3>
            <p>A reusable agent skill that turns high-dimensional vectors into 2D plots with UMAP, PCA or t-SNE. Export interactive HTML or PNG, projected coordinates and reduction metadata.</p>
            <span className="ch-open">View skill on GitHub ↗</span>
          </div>
          <div className="ch-feature-art" aria-hidden="true">
            <span>HIGH-DIMENSIONAL VECTORS</span>
            <span>↓ UMAP · PCA · t-SNE ↓</span>
            <span>2D VISUALIZATION</span>
          </div>
        </a>
      </section>
    </main>
  );
}
