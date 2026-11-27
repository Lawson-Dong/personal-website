import { ArrowUpRight, Code2 } from 'lucide-react';
import styles from './projects.module.css';

export const metadata = {
  title: 'Machine Learning and Deep Learning Projects',
  description: 'PyTorch course notebooks, neural network experiments, the Kaggle Digit Recognizer project, and nano-GPT.',
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
  {
    title: 'PyTorch Computer Vision',
    filename: '3_PyTorch_Computer_Vision.ipynb',
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

const kaggleNotebooks = [
  {
    title: 'Digit Recognizer: Five-Fold Cross-Validation',
    filename: 'Kaggle_Digit_Recognizer_5_fold_cross_validation.ipynb',
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

export default function MachineLearningProjects() {
  return (
    <main className={'section shell python-foundation ' + styles.page}>
      <header className={styles.intro}>
        <h1 className="portal-title">Machine Learning and Deep Learning Projects</h1>
      </header>
      <section className={styles.section} aria-labelledby="pytorch-course">
        <div className={styles.sectionHead}>
          <h2 id="pytorch-course">Learn PyTorch Course Series</h2>
        </div>
        <p className={styles.groupCopy}>
          Notebooks following <a href="https://www.learnpytorch.io/">LearnPyTorch.io</a>,
          from the training workflow with linear regression through neural network classification and computer vision.
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
      <section className={styles.section} aria-labelledby="kaggle">
        <div className={styles.sectionHead}>
          <h2 id="kaggle">Kaggle</h2>
        </div>
        <p className={styles.groupCopy}>
          Three CNN configurations train across five stratified folds. The resulting 15 models
          combine their predictions through soft voting to produce a Kaggle submission.
        </p>
        <NotebookLinks notebooks={kaggleNotebooks} />
      </section>
      <section className={styles.section} aria-labelledby="nano-gpt">
        <div className={styles.sectionHead}>
          <h2 id="nano-gpt">nano-GPT</h2>
        </div>
        <p className={styles.groupCopy}>
          A four-layer, decoder-only Transformer built from scratch in PyTorch, inspired by Andrej Karpathy’s
          nanoGPT and trained on Tiny Shakespeare. The code covers GPT-2 tokenization, causal multi-head
          self-attention, and autoregressive text generation with temperature and top-k sampling.
          Baseline training averaged about 1,776 tokens per second on a Windows laptop CPU, and a
          separate benchmark compared five CPU thread counts.
        </p>
        <div className={styles.actions}>
          <a
            className={styles.primary}
            href="https://github.com/Lawson-Dong/nano-GPT"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Code2 aria-hidden="true" />
            <span>View on GitHub</span>
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </section>
    </main>
  );
}
