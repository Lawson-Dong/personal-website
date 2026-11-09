import Link from 'next/link';
import { ArrowUpRight, Code2 } from 'lucide-react';
import styles from './pytorch.module.css';

export const metadata = {
  title: 'PyTorch Experience',
  description: 'Hands-on PyTorch notebooks on linear regression, nonlinearity, and ReLU network width and depth.',
};

const workflowNotebookUrl =
  'https://github.com/Lawson-Dong/personal-website/blob/main/notebooks/1_PyTorch_Workflow_Fundamentals.ipynb';
const nonlinearityNotebookUrl =
  'https://github.com/Lawson-Dong/personal-website/blob/main/notebooks/26_11_7_An_experiment_about_non_linearity_of__nn.ipynb';
const reluClassificationNotebookUrl =
  'https://github.com/Lawson-Dong/personal-website/blob/main/notebooks/26_11_8_How_to_improve_the_classification_ability_of_ReLU_network.ipynb';

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
          My PyTorch notebooks cover the training workflow through linear
          regression and compare linear networks with ReLU networks on a
          two-circle classification task. A follow-up experiment compares a
          baseline ReLU network with wider and deeper variants on a four-class
          concentric-ring dataset.
        </p>
        <div className={styles.actions}>
          <a className={styles.primary} href={workflowNotebookUrl} target="_blank" rel="noopener noreferrer">
            <Code2 aria-hidden="true" />
            PyTorch Workflow Fundamentals
            <ArrowUpRight aria-hidden="true" />
          </a>
          <a className={styles.secondary} href={nonlinearityNotebookUrl} target="_blank" rel="noopener noreferrer">
            <Code2 aria-hidden="true" />
            Nonlinearity in Neural Networks
            <ArrowUpRight aria-hidden="true" />
          </a>
          <a className={styles.secondary} href={reluClassificationNotebookUrl} target="_blank" rel="noopener noreferrer">
            <Code2 aria-hidden="true" />
            How to Improve the Classification Ability of ReLU Networks
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
        <p className={styles.miniNote}>
          Three notebooks · View on GitHub · Work in progress
        </p>
      </header>
    </main>
  );
}
