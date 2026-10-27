import Link from 'next/link';
import { Code2, ArrowUpRight } from 'lucide-react';

export const metadata = {
  title: 'Pytorch Experience',
  description: 'Hands-on PyTorch and deep learning experiments in a single Colab notebook.',
};

const colabUrl = 'https://colab.research.google.com/drive/1yRgFCAF5C3v9RdjPd2VeFfKQHtK1EwcB#scrollTo=YHaYTp2w-EWb';

export default function PytorchExperience() {
  return (
    <main className="section shell empty-module python-foundation">
      <nav className="science-breadcrumb" aria-label="Breadcrumb">
        <Link href="/coding">Coding and AI Engineering</Link>
        <span>/</span>
        <span>Pytorch Experience</span>
      </nav>
      <p className="eyebrow">PYTORCH / HANDS-ON DEEP LEARNING</p>
      <h1 className="portal-title">Pytorch <em>Experience.</em></h1>
      <p className="portal-copy">
        A growing collection of PyTorch exercises and deep learning experiments,
        all in one Google Colab notebook.
      </p>

      <a className="python-notebook-link" href={colabUrl} target="_blank" rel="noopener noreferrer">
        <span className="notebook-code-icon"><Code2 aria-hidden="true" /></span>
        <div>
          <span className="eyebrow">01 / OPEN IN GOOGLE COLAB</span>
          <h2>Learning Deep Learning using PyTorch</h2>
          <p>
            Explore model forward passes, activation functions, ablation ideas,
            and fine-tuning a pretrained ResNet.
          </p>
          <small>One notebook · PyTorch practice · Google Colab</small>
        </div>
        <ArrowUpRight className="notebook-launch" aria-hidden="true" />
      </a>
    </main>
  );
}
