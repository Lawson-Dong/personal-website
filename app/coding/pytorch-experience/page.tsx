import Link from 'next/link';
import { ArrowUpRight, Code2 } from 'lucide-react';
import styles from './pytorch.module.css';

export const metadata = {
  title: 'PyTorch Experience',
  description: 'Learn PyTorch course notebooks and personal experiments on nonlinearity and ReLU networks.',
};

const notebooksUrl = 'https://github.com/Lawson-Dong/personal-website/blob/main/notebooks/';

const courseNotebooks = [
  {
    title: 'PyTorch Workflow Fundamentals',
    filename: '1_PyTorch_Workflow_Fundamentals.ipynb',
  },
  {
    title: 'PyTorch Neural Network Classification',
    filename: '2_PyTorch_Neural_Network_Classification.ipynb',
  },
];

const explorationNotebooks = [
  {
    title: 'Nonlinearity in Neural Networks',
    filename: '26_11_7_An_experiment_about_non_linearity_of__nn.ipynb',
  },
  {
    title: 'How to Improve the Classification Ability of ReLU Networks',
    filename: '26_11_8_How_to_improve_the_classification_ability_of_ReLU_network.ipynb',
  },
];

function NotebookLinks({ notebooks }: { notebooks: { title: string; filename: string }[] }) {
  return (
    <div className={styles.actions}>
      {notebooks.map(({ title, filename }) => (
        <a
          key={filename}
          className={styles.primary}
          href={notebooksUrl + filename}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Code2 aria-hidden="true" />
          <span>{title}</span>
          <ArrowUpRight aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

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
          My notes from learning PyTorch and the experiments those lessons inspired.
        </p>
      </header>
      <section className={styles.section} aria-labelledby="pytorch-course">
        <div className={styles.sectionHead}>
          <h2 id="pytorch-course">Learn PyTorch Course Series</h2>
        </div>
        <p className={styles.groupCopy}>
          Notebooks following <a href="https://www.learnpytorch.io/">LearnPyTorch.io</a>,
          from the training workflow with linear regression to binary and multiclass classification.
        </p>
        <NotebookLinks notebooks={courseNotebooks} />
      </section>
      <section className={`${styles.section} ${styles.explorations}`} aria-labelledby="pytorch-explorations">
        <div className={styles.sectionHead}>
          <h2 id="pytorch-explorations">Personal PyTorch Explorations</h2>
        </div>
        <p className={styles.groupCopy}>
          Experiments on how nonlinear activations, network width, and depth affect
          classification on concentric circles.
        </p>
        <NotebookLinks notebooks={explorationNotebooks} />
      </section>
      <p className={styles.miniNote}>
        Four notebooks · View on GitHub · Work in progress
      </p>
    </main>
  );
}
