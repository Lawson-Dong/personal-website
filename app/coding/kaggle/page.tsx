import Link from 'next/link';
import { NotebookText } from 'lucide-react';

export const metadata = {
  title: 'Kaggle',
  description: 'Kaggle competition notebooks by Lawson Dong, starting with five-fold cross-validation for Digit Recognizer.',
};

const notebookUrl = 'https://github.com/Lawson-Dong/personal-website/blob/main/notebooks/Kaggle_Digit_Recognizer_5_fold_cross_validation.ipynb';

export default function Kaggle() {
  return (
    <main className="section shell python-foundation">
      <nav className="science-breadcrumb" aria-label="Breadcrumb">
        <Link href="/coding">Coding</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Kaggle</span>
      </nav>
      <h1 className="portal-title">Kaggle</h1>
      <div className="science-folders single-folder">
        <a className="science-folder" href={notebookUrl} target="_blank" rel="noopener noreferrer">
          <span className="folder-top">
            <NotebookText aria-hidden="true" />
            <span>PYTORCH / MNIST</span>
          </span>
          <h2>Digit Recognizer: Five-Fold Cross-Validation</h2>
          <p>
            Three CNN configurations train across five stratified folds. The resulting 15 models
            combine their predictions through soft voting to produce a Kaggle submission.
          </p>
          <span className="portal-card-link">View notebook on GitHub</span>
        </a>
      </div>
    </main>
  );
}
