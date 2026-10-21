import Link from 'next/link';
import { ArrowUpRight, Code2 } from 'lucide-react';

export const metadata = { title: 'LeetCode Notes' };
const colab = 'https://colab.research.google.com/github/Lawson-Dong/personal-website/blob/main/notebooks/leetcode-linked-list-basic-notes.ipynb';
const github = 'https://github.com/Lawson-Dong/personal-website/blob/main/notebooks/leetcode-linked-list-basic-notes.ipynb';

export default function LeetCodeNotes() {
  return (
    <main className="section shell python-foundation">
      <nav className="science-breadcrumb" aria-label="Breadcrumb"><Link href="/coding">Coding and AI Engineering</Link><span>/</span><Link href="/coding/leetcode">LeetCode</Link><span>/</span><span>LeetCode Notes</span></nav>
      <p className="eyebrow">LEETCODE / ALGORITHM FOUNDATIONS</p>
      <h1 className="portal-title">LeetCode <em>Notes.</em></h1>
      <p className="portal-copy">Concise concepts and examples to revisit before solving problems.</p>
      <section aria-labelledby="linked-list-title">
        <h2 id="linked-list-title" style={{fontFamily:'Georgia, serif',fontSize:'clamp(30px,3.4vw,44px)',fontWeight:400,margin:'52px 0 16px'}}>Linked <em style={{color:'var(--accent)'}}>List.</em></h2>
        <a className="python-notebook-link" href={colab} target="_blank" rel="noopener noreferrer">
          <span className="notebook-code-icon"><Code2 aria-hidden="true" /></span>
          <div><span className="eyebrow">01 / OPEN IN GOOGLE COLAB</span><h2>Linked List — Basic Notes</h2><p>Nodes, pointers, dummy heads, traversal, and returning a linked list. A six-section English reference.</p><small>Six sections · Python code snippets · English</small></div>
          <ArrowUpRight className="notebook-launch" aria-hidden="true" />
        </a>
        <a className="text-link" href={github} target="_blank" rel="noopener noreferrer">View notebook on GitHub ↗</a>
      </section>
      <section aria-labelledby="sorting-title" style={{marginTop:70,borderTop:'1px solid var(--rule)',paddingTop:24}}>
        <h2 id="sorting-title" style={{fontFamily:'Georgia, serif',fontSize:'clamp(30px,3.4vw,44px)',fontWeight:400}}>Sort.</h2>
        <p style={{color:'var(--muted)',fontSize:14}}>Notes coming soon.</p>
      </section>
      <section aria-labelledby="binary-title" style={{marginTop:40,borderTop:'1px solid var(--rule)',paddingTop:24}}>
        <h2 id="binary-title" style={{fontFamily:'Georgia, serif',fontSize:'clamp(30px,3.4vw,44px)',fontWeight:400}}>Binary Search.</h2>
        <p style={{color:'var(--muted)',fontSize:14}}>Notes coming soon.</p>
      </section>
    </main>
  );
}
