import Image from 'next/image';
import Link from 'next/link';
import { Code2 } from 'lucide-react';
import indexingDiagram from '../../../public/images/numpy/array-indexing.png';

export const metadata = {
  title: 'Numpy',
  description: 'A hands-on NumPy notebook and a visual reference for array indexing.',
};

const notebookUrl =
  'https://github.com/Lawson-Dong/personal-website/blob/main/notebooks/Introduction_to_Numpy.ipynb';

export default function NumpyPage() {
  return (
    <main className="section shell">
      <nav className="science-breadcrumb" aria-label="Breadcrumb">
        <Link href="/coding">Coding</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Numpy</span>
      </nav>
      <h1 className="portal-title">Numpy</h1>

      <a className="python-notebook-link" href={notebookUrl} target="_blank" rel="noopener noreferrer">
        <span className="notebook-code-icon">
          <Code2 aria-hidden="true" />
        </span>
        <div>
          <span className="eyebrow">VIEW NOTEBOOK ON GITHUB</span>
          <h2>Introduction to Numpy</h2>
          <p>Practice creating, indexing, and reshaping arrays, then explore arithmetic, linear algebra, and statistics.</p>
        </div>
      </a>

      <figure className="mt-10 max-w-[700px]">
        <figcaption className="mb-3 text-lg font-semibold">Array indexing and slicing</figcaption>
        <Image
          src={indexingDiagram}
          alt="A 6-by-5 array with three highlighted selections: a 2-by-2 slice, four elements selected by paired row and column indices, and the last two columns of three selected rows."
          className="h-auto w-full rounded-lg"
          sizes="(max-width: 760px) 100vw, 700px"
        />
      </figure>
    </main>
  );
}
