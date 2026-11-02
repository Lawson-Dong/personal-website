import Link from 'next/link';
import { ArrowUpRight, Code2 } from 'lucide-react';
import styles from './pytorch.module.css';

export const metadata = {
  title: 'PyTorch Experience',
  description: 'PyTorch learning notes and simplified experimental code in Jupyter notebooks.',
};

const notebookUrl =
  'https://github.com/Lawson-Dong/personal-website/blob/main/notebooks/Learning_Deep_Learning_using_pytorch.ipynb';

const experimentalNotebookUrl =
  'https://github.com/Lawson-Dong/personal-website/blob/main/notebooks/Simplified_Exprimental_Code.ipynb';

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
          My evolving PyTorch notebooks: tensor foundations, pretrained model
          inference, ResNet architecture and activation experiments, CIFAR-10
          data preparation, an end-to-end linear regression workflow with training/test
          splits, model building, gradient descent, and evaluation, and a cat–dog workflow covering blockwise feature extraction, reproducible
          sampling, and within-class participation ratio (PR) analysis.
        </p>
        <div className={styles.actions}>
          <a className={styles.primary} href={notebookUrl} target="_blank" rel="noopener noreferrer">
            <Code2 aria-hidden="true" />
            Learning Deep Learning using PyTorch
            <ArrowUpRight aria-hidden="true" />
          </a>
          <a className={styles.secondary} href={experimentalNotebookUrl} target="_blank" rel="noopener noreferrer">
            <Code2 aria-hidden="true" />
            Simplified Experimental Code
            <ArrowUpRight aria-hidden="true" />
          </a>
          <a className={styles.secondary} href={workflowNotebookUrl} target="_blank" rel="noopener noreferrer">
            <Code2 aria-hidden="true" />
            PyTorch Workflow Fundamentals
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
        <p className={styles.miniNote}>
          Three notebooks · View on GitHub · Work in progress
          <br />
          Experimental notebook updated October 31, 2026 · Eight residual blocks,
          global average pooling, L2 normalization, and Gram-matrix PR.
        </p>
      </header>
    </main>
  );
}
