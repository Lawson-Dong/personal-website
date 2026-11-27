import Link from 'next/link';

export const metadata = { title: 'Coding' };

export default function Coding() {
  return (
    <main className="section shell">
      <p className="eyebrow">LEARNING BY BUILDING</p>
      <h1 className="portal-title">Coding</h1>
      <p className="portal-copy">The foundations behind my experiments, one concept at a time.</p>
      <Link className="portal-card" href="/coding/python-foundation">
        <span className="eyebrow">01 / PYTHON</span>
        <h2>Python Foundation</h2>
        <span className="portal-card-link">Open Python Foundation</span>
      </Link>
      <Link className="portal-card" href="/coding/numpy">
        <h2>Numpy</h2>
        <p>An introductory notebook and a visual guide to array indexing.</p>
        <span className="portal-card-link">Explore Numpy</span>
      </Link>
      <Link className="portal-card" href="/coding/linux">
        <span className="eyebrow">02 / LINUX</span>
        <h2>Linux</h2>
        <p>Linux fundamentals, WSL2 setup, Python virtual environments, and PyTorch workflows.</p>
        <span className="portal-card-link">Explore Linux</span>
      </Link>
      <Link className="portal-card" href="/coding/leetcode">
        <span className="eyebrow">03 / ALGORITHMS</span>
        <h2>LeetCode</h2>
        <p>Algorithm solutions and structured notes on linked lists, sorting, and binary search.</p>
        <span className="portal-card-link">Explore LeetCode</span>
      </Link>
    </main>
  );
}
