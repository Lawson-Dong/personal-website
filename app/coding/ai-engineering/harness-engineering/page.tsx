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
      <Link className="ch-feature" href="/coding/ai-engineering/harness-engineering/agent-skills">
        <div>
          <p className="ch-kicker">02 / REUSABLE AGENT TOOLS</p>
          <h2>Agent Skills</h2>
          <p>Reusable instructions and executable tools for an agent’s work, starting with high-dimensional vector visualization.</p>
          <span className="ch-open">Explore Agent Skills ↗</span>
        </div>
        <div className="ch-feature-art" aria-hidden="true">
          <span>INSTRUCTIONS</span><span>TOOLS</span><span>REUSABLE WORKFLOWS</span>
        </div>
      </Link>
    </main>
  );
}
