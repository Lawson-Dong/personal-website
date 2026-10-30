import Link from 'next/link';
import { ArrowUpRight, Code2 } from 'lucide-react';
import styles from './pytorch.module.css';

export const metadata = {
  title: 'PyTorch Experience',
  description: 'PyTorch learning notes and simplified experimental code in Jupyter notebooks.',
};

const notebookUrl =
  'https://colab.research.google.com/github/Lawson-Dong/personal-website/blob/main/notebooks/Learning_Deep_Learning_using_pytorch.ipynb';

const experimentalNotebookUrl =
  'https://colab.research.google.com/github/Lawson-Dong/personal-website/blob/main/notebooks/Simplified_Exprimental_Code.ipynb';

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
          data preparation, and a cat–dog feature extraction workflow.
        </p>
        <div className={styles.actions}>
          <a className={styles.primary} href={notebookUrl} target="_blank" rel="noopener noreferrer">
            <Code2 aria-hidden="true" />
            Open latest PyTorch notebook
            <ArrowUpRight aria-hidden="true" />
          </a>
          <a className={styles.secondary} href={experimentalNotebookUrl} target="_blank" rel="noopener noreferrer">
            <Code2 aria-hidden="true" />
            Simplified Experimental Code
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
        <p className={styles.miniNote}>
          Two notebooks · Open in Google Colab · Work in progress
        </p>
      </header>
    </main>
  );
}
