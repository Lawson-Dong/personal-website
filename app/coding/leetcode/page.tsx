import Link from 'next/link';
import { ArrowUpRight, BookOpenText, Code2 } from 'lucide-react';

export const metadata = { title: 'LeetCode' };

export default function LeetCode() {
  return (
    <main className="section shell python-foundation">
      <nav className="science-breadcrumb" aria-label="Breadcrumb"><Link href="/coding">Coding and AI Engineering</Link><span>/</span><span>LeetCode</span></nav>
      <p className="eyebrow">ALGORITHMS / PRACTICE & UNDERSTANDING</p>
      <h1 className="portal-title">Leet<em>Code.</em></h1>
      <p className="portal-copy">Solutions and conceptual notes, organized for reviewing algorithms one idea at a time.</p>
      <div className="science-folders">
        <a className="science-folder" href="https://github.com/Lawson-Dong/leetcode-solution" target="_blank" rel="noopener noreferrer">
          <span className="folder-top"><Code2 aria-hidden="true" /><span>01 / PRACTICE</span></span>
          <h2>LeetCode Solutions</h2>
          <p>Accepted algorithm solutions and implementations in GitHub.</p>
          <span className="portal-card-link">View solutions <ArrowUpRight size={15} aria-hidden="true" /></span>
        </a>
        <Link className="science-folder" href="/coding/leetcode/notes">
          <span className="folder-top"><BookOpenText aria-hidden="true" /><span>02 / CONCEPTS</span></span>
          <h2>LeetCode Notes</h2>
          <p>Foundations, code patterns, and review notebooks grouped by algorithm topic.</p>
          <span className="portal-card-link">Explore notes ↗</span>
        </Link>
      </div>
    </main>
  );
}
