import Link from 'next/link';

export const metadata = {
  title: 'Agent Skills — Harness Engineering',
  description: 'Reusable agent skills for vector visualization and reliable research artifact publishing.',
};

export default function AgentSkills() {
  return (
    <main className="section shell ch-page">
      <nav className="ch-crumb" aria-label="Breadcrumb">
        <Link href="/coding">Coding</Link> /{' '}
        <Link href="/coding/ai-engineering">AI Engineering</Link> /{' '}
        <Link href="/coding/ai-engineering/harness-engineering">Harness Engineering</Link> / Agent Skills
      </nav>
      <p className="ch-kicker">HARNESS ENGINEERING / REUSABLE AGENT TOOLS</p>
      <h1>Agent <em>Skills.</em></h1>
      <p className="ch-lead">Reusable instructions and executable resources that give an AI agent a repeatable workflow.</p>
      <a
        className="ch-feature"
        href="https://github.com/Lawson-Dong/agent-skill/tree/main/skills/high-dimensional-vector-visualization-executer"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div>
          <p className="ch-kicker">01 / VECTOR GEOMETRY &amp; VISUALIZATION</p>
          <h2>High Dimensional Vector Visualization Executer</h2>
          <p>Turn high-dimensional vectors into 2D plots with UMAP, PCA or t-SNE. Export interactive HTML or PNG, projected coordinates and reduction metadata.</p>
          <span className="ch-open">View skill on GitHub ↗</span>
        </div>
        <div className="ch-feature-art" aria-hidden="true">
          <span>HIGH-DIMENSIONAL VECTORS</span>
          <span>↓ UMAP · PCA · t-SNE ↓</span>
          <span>2D VISUALIZATION</span>
        </div>
      </a>
      <a
        className="ch-feature"
        href="https://github.com/Lawson-Dong/agent-skill/tree/main/skills/publish-research-artifacts"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div>
          <p className="ch-kicker">02 / RESEARCH ARTIFACT PUBLISHING</p>
          <h2>Publish Research Artifacts</h2>
          <p>Publish completed notebooks, per-metric CSVs and figures to GitHub. Resume interrupted uploads with persistent checkpoints, keep large file payloads out of conversation and verify published files against their source hashes.</p>
          <span className="ch-open">View skill on GitHub ↗</span>
        </div>
        <div className="ch-feature-art" aria-hidden="true">
          <span>NOTEBOOKS · CSVs · FIGURES</span>
          <span>CHECKPOINT · RESUME · PUBLISH</span>
          <span>REMOTE HASH VERIFICATION</span>
        </div>
      </a>
      <p className="ch-lead">Browse the <a href="https://github.com/Lawson-Dong/agent-skill" target="_blank" rel="noopener noreferrer">Agent Skills repository ↗</a> for skill instructions, executable resources and examples.</p>
      <Link className="ch-open" href="/coding/ai-engineering/harness-engineering">← Back to Harness Engineering</Link>
    </main>
  );
}
