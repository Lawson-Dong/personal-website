import Link from 'next/link';

export const metadata = {
  title: 'Linux',
  description: 'Linux learning notes: introduction, environment setup and training deep neural networks.',
};

const notes = [
  { title: 'Introduction', file: 'Introduction.pdf', label: '01 / INTRODUCTION' },
  { title: 'Setup Environment', file: 'Setup Environment.pdf', label: '02 / ENVIRONMENT SETUP' },
  { title: 'Training Deep Neural Networks', file: 'Training Deep Neural Networks.pdf', label: '03 / MODEL TRAINING' },
];
const githubBase = 'https://github.com/Lawson-Dong/personal-website/blob/main/notes/linux/';

export default function Linux() {
  return (
    <main className="section shell">
      <nav className="science-breadcrumb" aria-label="Breadcrumb">
        <Link href="/coding">Coding and AI Engineering</Link><span>/</span><span>Linux</span>
      </nav>
      <p className="eyebrow">LEARNING BY BUILDING / LINUX</p>
      <h1 className="portal-title"><em>Linux.</em></h1>
      <p className="portal-copy">From the first terminal commands to a working environment for training neural networks.</p>
      {notes.map((note) => (
        <a className="portal-card" key={note.file} href={`${githubBase}${encodeURIComponent(note.file)}`} target="_blank" rel="noopener noreferrer">
          <span className="eyebrow">{note.label}</span>
          <h2>{note.title}</h2>
          <span className="portal-card-link">Open PDF on GitHub ↗</span>
        </a>
      ))}
    </main>
  );
}
