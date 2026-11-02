import Link from 'next/link';
import { ArrowUpRight, Code2 } from 'lucide-react';
import styles from './pytorch.module.css';

export const metadata = {
  title: 'PyTorch Experience',
  description: 'PyTorch workflow fundamentals: data preparation, linear regression, training, and evaluation.',
};

const workflowNotebookUrl =
  'https://github.com/Lawson-Dong/personal-website/blob/main/notebooks/1_PyTorch_Workflow_Fundamentals.ipynb';

export default function PytorchExperience() {
  return (
    <main className={'section shell python-foundation ' + styles.page}>
      <nav className="science-breadcrumb" aria-label="Breadcrumb">
        <Link href="/coding">Coding and AI Engineering</Link>
        <span>/</span>
        <span>PyTorch Experience</span>
      </nav>
      <header className={styles.intro}>
        <p className="eyebrow">PYTORCH / HANDS-ON DEEP LEARNING</p>
        <h1 className="portal-title">PyTorch <em>Experience.</em></h1>
        <p className="portal-copy">
          My PyTorch workflow notebook: data preparation and visualization,
          training/test splits, building a linear regression model, gradient
          descent, and evaluation.
        </p>
        <div className={styles.actions}>
          <a className={styles.primary} href={workflowNotebookUrl} target="_blank" rel="noopener noreferrer">
            <Code2 aria-hidden="true" />
            PyTorch Workflow Fundamentals
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
        <p className={styles.miniNote}>
          One notebook · View on GitHub · Work in progress
        </p>
      </header>
    </main>
  );
}
