import Link from 'next/link';
import { ArrowUpRight, Code2 } from 'lucide-react';

export const metadata = {
  title: 'Python Foundation',
  description: 'Python foundations explored through one hands-on Jupyter notebook about loops and control flow.',
};

const notebookUrl =
  'https://colab.research.google.com/github/Lawson-Dong/personal-website/blob/main/notebooks/09_Loops.ipynb';

export default function PythonFoundation() {
  return (
    <main className="section shell empty-module python-foundation">
      <nav className="science-breadcrumb" aria-label="Breadcrumb">
        <Link href="/coding">Coding and AI Engineering</Link>
        <span>/</span>
        <span>Python Foundation</span>
      </nav>
      <p className="eyebrow">THE FOUNDATIONS / HANDS-ON NOTEBOOK</p>
      <h1 className="portal-title">Python <em>Foundation.</em></h1>
      <a className="python-notebook-link" href={notebookUrl} target="_blank" rel="noopener noreferrer">
        <span className="notebook-code-icon">
          <Code2 aria-hidden="true" />
        </span>
        <div>
          <span className="eyebrow">OPEN NOTEBOOK IN GOOGLE COLAB</span>
          <h2>Python Loops &amp; Control Flow</h2>
          <p>Practice <code>for</code> and <code>while</code> loops, <code>range</code>, <code>break</code>, and <code>continue</code> in the notebook.</p>
          <small>09_Loops.ipynb · Jupyter Notebook</small>
        </div>
        <ArrowUpRight className="notebook-launch" aria-hidden="true" />
      </a>
    </main>
  );
}
