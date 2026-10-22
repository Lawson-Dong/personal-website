import Link from 'next/link';
import { Code2, ArrowUpRight } from 'lucide-react';

export const metadata = {
  title: 'Pytorch Experience',
  description: 'Short, runnable PyTorch notes with official API references.',
};

const colabUrl = 'https://colab.research.google.com/github/Lawson-Dong/personal-website/blob/main/notebooks/pytorch-model-to.ipynb';
const githubUrl = 'https://github.com/Lawson-Dong/personal-website/blob/main/notebooks/pytorch-model-to.ipynb';

export default function PytorchExperience() {
  return (
    <main className="section shell empty-module python-foundation">
      <nav className="science-breadcrumb" aria-label="Breadcrumb">
        <Link href="/coding">Coding and AI Engineering</Link>
        <span>/</span>
        <span>Pytorch Experience</span>
      </nav>
      <p className="eyebrow">PYTORCH / SHORT, RUNNABLE NOTES</p>
      <h1 className="portal-title">Pytorch <em>Experience.</em></h1>
      <p className="portal-copy">One PyTorch API at a time. Simple code, clear meanings, official docs.</p>

      <a className="python-notebook-link" href={colabUrl} target="_blank" rel="noopener noreferrer">
        <span className="notebook-code-icon"><Code2 aria-hidden="true" /></span>
        <div>
          <span className="eyebrow">01 / OPEN IN GOOGLE COLAB</span>
          <h2>model.to() — device, dtype, non_blocking</h2>
          <p>Move a model to GPU, choose BF16, and understand eval() and asynchronous transfers.</p>
          <small>2 tiny runnable examples · PyTorch official docs · Janus reference</small>
        </div>
        <ArrowUpRight className="notebook-launch" aria-hidden="true" />
      </a>

      <a className="text-link" href={githubUrl} target="_blank" rel="noopener noreferrer">View notebook on GitHub ↗</a>

      <a className="python-notebook-link" href="https://colab.research.google.com/github/Lawson-Dong/personal-website/blob/main/notebooks/pytorch-forward-and-hooks.ipynb" target="_blank" rel="noopener noreferrer">
        <span className="notebook-code-icon"><Code2 aria-hidden="true" /></span>
        <div>
          <span className="eyebrow">02 / OPEN IN GOOGLE COLAB</span>
          <h2>model(x) vs model.forward(x) — Hooks</h2>
          <p>See how the forward call works, what a hook does, and when it runs.</p>
          <small>1 visual diagram · 3 tiny runnable examples · Official PyTorch docs</small>
        </div>
        <ArrowUpRight className="notebook-launch" aria-hidden="true" />
      </a>
      <a className="text-link" href="https://github.com/Lawson-Dong/personal-website/blob/main/notebooks/pytorch-forward-and-hooks.ipynb" target="_blank" rel="noopener noreferrer">View notebook 02 on GitHub ↗</a>

      <a className="python-notebook-link" href="https://colab.research.google.com/github/Lawson-Dong/personal-website/blob/main/notebooks/pytorch-train-vs-eval.ipynb" target="_blank" rel="noopener noreferrer">
        <span className="notebook-code-icon"><Code2 aria-hidden="true" /></span>
        <div>
          <span className="eyebrow">03 / OPEN IN GOOGLE COLAB</span>
          <h2>model.train() vs model.eval()</h2>
          <p>Switch modes, compare Dropout behavior, and see why eval() does not run inference.</p>
          <small>1 clear diagram · 2 runnable examples · Official PyTorch docs</small>
        </div>
        <ArrowUpRight className="notebook-launch" aria-hidden="true" />
      </a>
      <a className="text-link" href="https://github.com/Lawson-Dong/personal-website/blob/main/notebooks/pytorch-train-vs-eval.ipynb" target="_blank" rel="noopener noreferrer">View notebook 03 on GitHub ↗</a>

      <a className="python-notebook-link" href="https://colab.research.google.com/github/Lawson-Dong/personal-website/blob/main/notebooks/pytorch-device-selection.ipynb" target="_blank" rel="noopener noreferrer">
        <span className="notebook-code-icon"><Code2 aria-hidden="true" /></span>
        <div>
          <span className="eyebrow">04 / OPEN IN GOOGLE COLAB</span>
          <h2>Choosing a Device — CUDA or CPU</h2>
          <p>Use torch.device(), check CUDA, and move both the model and input with .to(device).</p>
          <small>1 clear diagram · 2 runnable examples · Official PyTorch docs</small>
        </div>
        <ArrowUpRight className="notebook-launch" aria-hidden="true" />
      </a>
      <a className="text-link" href="https://github.com/Lawson-Dong/personal-website/blob/main/notebooks/pytorch-device-selection.ipynb" target="_blank" rel="noopener noreferrer">View notebook 04 on GitHub ↗</a>

      <a className="python-notebook-link" href="https://colab.research.google.com/github/Lawson-Dong/personal-website/blob/main/notebooks/pytorch-gradient-modes.ipynb" target="_blank" rel="noopener noreferrer">
        <span className="notebook-code-icon"><Code2 aria-hidden="true" /></span>
        <div>
          <span className="eyebrow">05 / OPEN IN GOOGLE COLAB</span>
          <h2>torch.no_grad() vs torch.inference_mode()</h2>
          <p>Compare gradient tracking and learn when inference tensors have extra restrictions.</p>
          <small>1 visual diagram · 2 runnable examples · Official PyTorch docs</small>
        </div>
        <ArrowUpRight className="notebook-launch" aria-hidden="true" />
      </a>
      <a className="text-link" href="https://github.com/Lawson-Dong/personal-website/blob/main/notebooks/pytorch-gradient-modes.ipynb" target="_blank" rel="noopener noreferrer">View notebook 05 on GitHub ↗</a>

      <a className="python-notebook-link" href="https://colab.research.google.com/github/Lawson-Dong/personal-website/blob/main/notebooks/pytorch-random-seed.ipynb" target="_blank" rel="noopener noreferrer">
        <span className="notebook-code-icon"><Code2 aria-hidden="true" /></span>
        <div>
          <span className="eyebrow">06 / OPEN IN GOOGLE COLAB</span>
          <h2>torch.manual_seed(42) — Random Seeds</h2>
          <p>Reproduce random tensors and understand why consecutive random calls still differ.</p>
          <small>2 tiny runnable examples · Official PyTorch docs</small>
        </div>
        <ArrowUpRight className="notebook-launch" aria-hidden="true" />
      </a>
      <a className="text-link" href="https://github.com/Lawson-Dong/personal-website/blob/main/notebooks/pytorch-random-seed.ipynb" target="_blank" rel="noopener noreferrer">View notebook 06 on GitHub ↗</a>
    </main>
  );
}
