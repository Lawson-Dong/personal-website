import Link from 'next/link';

export const metadata = {
  title: 'Linux',
  description: 'A practical guide to setting up WSL 2 and Ubuntu, training a first PyTorch neural network, and saving model weights.',
};

const tutorialUrl = 'https://dev.to/lawson_dong/training-my-first-neural-network-on-windows-with-wsl-2-and-pytorch-3him';

export default function Linux() {
  return (
    <main className="section shell">
      <nav className="science-breadcrumb" aria-label="Breadcrumb">
        <Link href="/coding">Coding and AI Engineering</Link><span>/</span><span>Linux</span>
      </nav>
      <p className="eyebrow">LEARNING BY BUILDING / LINUX</p>
      <h1 className="portal-title"><em>Linux.</em></h1>
      <p className="portal-copy">From the first terminal commands to a working environment for training neural networks.</p>
      <a className="portal-card" href={tutorialUrl} target="_blank" rel="noopener noreferrer">
        <span className="eyebrow">01 / HANDS-ON TUTORIAL</span>
        <h2>Training My First Neural Network on Windows with WSL 2 and PyTorch</h2>
        <p>Set up Ubuntu and a Python virtual environment, train an XOR neural network, and save its weights—with diagrams and troubleshooting notes.</p>
        <span className="portal-card-link">Read on DEV.to ↗</span>
      </a>
    </main>
  );
}
