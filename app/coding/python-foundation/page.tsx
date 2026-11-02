import Link from 'next/link';
import { ArrowUpRight, Code2 } from 'lucide-react';

export const metadata = {
  title: 'Python Foundation',
  description: 'Nine Python notebooks covering introductions, tooling, variables, operators, functions, conditionals, collections, debugging, and loops.',
};

const notebookBaseUrl =
  'https://github.com/Lawson-Dong/personal-website/blob/main/notebooks/';

const notebooks = [
  {
    "filename": "01-Introduction.ipynb",
    "title": "Introduction to Python",
    "description": "Course introduction, Python, and programming foundations."
  },
  {
    "filename": "02-Tooling.ipynb",
    "title": "Tools & Jupyter Notebooks",
    "description": "Python tooling, Jupyter notebooks, DataHub, and Anaconda."
  },
  {
    "filename": "03-Variables.ipynb",
    "title": "Variables",
    "description": "Assignment, namespaces, code style, and variable types."
  },
  {
    "filename": "04-Operators.ipynb",
    "title": "Operators",
    "description": "Assignment, arithmetic, logic, comparison, identity, and membership."
  },
  {
    "filename": "05-Functions.ipynb",
    "title": "Functions",
    "description": "Defining and calling functions, return values, and arguments."
  },
  {
    "filename": "06-Conditionals.ipynb",
    "title": "Conditionals",
    "description": "Branching with if, elif, and else."
  },
  {
    "filename": "07-Collections.ipynb",
    "title": "Collections",
    "description": "Lists, tuples, dictionaries, indexing, mutation, chr, and ord."
  },
  {
    "filename": "08-Debugging.ipynb",
    "title": "Debugging",
    "description": "Syntax errors, exceptions, stack traces, and try/except."
  },
  {
    "filename": "09_Loops.ipynb",
    "title": "Python Loops & Control Flow",
    "description": "Practice for and while loops, range, break, and continue."
  }
];

export default function PythonFoundation() {
  return (
    <main className="section shell empty-module python-foundation">
      <nav className="science-breadcrumb" aria-label="Breadcrumb">
        <Link href="/coding">Coding and AI Engineering</Link>
        <span>/</span>
        <span>Python Foundation</span>
      </nav>
      <p className="eyebrow">THE FOUNDATIONS / HANDS-ON NOTEBOOKS</p>
      <h1 className="portal-title">Python <em>Foundation.</em></h1>
      <p className="portal-copy">Python course notebooks and learning notes, from the first tools to loops and control flow. Browse all nine notebooks on GitHub.</p>
      {notebooks.map((notebook) => (
        <a className="python-notebook-link" key={notebook.filename} href={notebookBaseUrl + notebook.filename} target="_blank" rel="noopener noreferrer">
          <span className="notebook-code-icon">
            <Code2 aria-hidden="true" />
          </span>
          <div>
            <span className="eyebrow">{notebook.filename.slice(0, 2)} / VIEW NOTEBOOK ON GITHUB</span>
            <h2>{notebook.title}</h2>
            <p>{notebook.description}</p>
            <small>{notebook.filename} · Jupyter Notebook</small>
          </div>
          <ArrowUpRight className="notebook-launch" aria-hidden="true" />
        </a>
      ))}
    </main>
  );
}
