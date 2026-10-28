import Link from 'next/link';
import { ArrowUpRight, BookOpen, Code2, Cpu, Database, FlaskConical, Layers } from 'lucide-react';
import styles from './pytorch.module.css';

export const metadata = {
  title: 'PyTorch Experience',
  description: 'Hands-on PyTorch notes: ResNet-18 inference, residual-block and activation ablations, and CIFAR-10 training preparation.',
};

const notebookUrl =
  'https://colab.research.google.com/github/Lawson-Dong/personal-website/blob/main/notebooks/Learning_Deep_Learning_using_pytorch.ipynb';
const sourceUrl =
  'https://github.com/Lawson-Dong/personal-website/blob/main/notebooks/Learning_Deep_Learning_using_pytorch.ipynb';

const topics = [
  {
    number: '01',
    title: 'Pretrained inference',
    description: 'Select CPU or CUDA, switch a pretrained ResNet-18 to eval mode, run inference without autograd, and inspect a [4, 1000] output tensor.',
    icon: Cpu,
    status: 'Explored',
  },
  {
    number: '02',
    title: 'Model architecture ablation',
    description: 'Use nn.Identity() to replace layer2[1] and observe how removing an entire residual block changes the forward computation.',
    icon: Layers,
    status: 'Explored',
  },
  {
    number: '03',
    title: 'Activation ablation',
    description: 'Swap ReLU, LeakyReLU, and GELU in the same pretrained BasicBlock, holding the input and original pretrained weights fixed.',
    icon: FlaskConical,
    status: 'Explored',
  },
  {
    number: '04',
    title: 'CIFAR-10 training setup',
    description: 'Set seeds, normalize inputs, create a 45k/5k split, build DataLoaders, and adapt ResNet-18 to 32×32 images.',
    icon: Database,
    status: 'In progress',
  },
];

const examples = [
  {
    number: '01 / INFERENCE',
    title: 'A pretrained model makes predictions',
    description: 'Inference uses model.eval() for evaluation behavior and torch.inference_mode() to disable autograd tracking. A batch of four ImageNet-sized images produces four vectors of 1,000 logits.',
    code: [
      'import torch',
      'from torchvision.models import resnet18, ResNet18_Weights',
      '',
      'device = torch.device("cuda" if torch.cuda.is_available() else "cpu")',
      'model = resnet18(weights=ResNet18_Weights.DEFAULT).to(device)',
      'model.eval()',
      '',
      'x = torch.randn(4, 3, 224, 224, device=device)',
      'with torch.inference_mode():',
      '    output = model(x)',
      '',
      'print(output.shape)  # torch.Size([4, 1000])',
    ].join('\n'),
  },
  {
    number: '02 / STRUCTURE',
    title: 'Remove a residual block',
    description: 'Replacing layer2[1] with nn.Identity() removes that complete BasicBlock from the sequential path. This is a structural intervention, not a single-neuron or single-activation change.',
    code: [
      'import torch.nn as nn',
      '',
      'ablated = resnet18(weights=ResNet18_Weights.DEFAULT)',
      'baseline = resnet18(weights=ResNet18_Weights.DEFAULT)',
      '',
      'ablated.layer2[1] = nn.Identity()',
      'ablated = ablated.to(device).eval()',
      'baseline = baseline.to(device).eval()',
      '',
      'with torch.inference_mode():',
      '    ablated_logits = ablated(x)',
      '    baseline_logits = baseline(x)',
    ].join('\n'),
  },
  {
    number: '03 / ACTIVATIONS',
    title: 'ReLU vs LeakyReLU vs GELU',
    description: 'Compare forward-pass outputs while keeping the network weights and inputs fixed. The layer2[1].relu module is used twice inside a ResNet BasicBlock, so this substitution changes both calls.',
    code: [
      'import torch.nn as nn',
      '',
      'activations = {',
      '    "ReLU": nn.ReLU,',
      '    "LeakyReLU": nn.LeakyReLU,',
      '    "GELU": nn.GELU,',
      '}',
      'results = {}',
      '',
      'with torch.inference_mode():',
      '    for name, activation in activations.items():',
      '        model = resnet18(weights=ResNet18_Weights.DEFAULT)',
      '        model.layer2[1].relu = activation()',
      '        model = model.to(device).eval()',
      '        results[name] = model(x).cpu()',
    ].join('\n'),
  },
  {
    number: '04 / DATA PREPARATION',
    title: 'Build a reproducible CIFAR-10 split',
    description: 'The notebook configures a seeded 45,000-image training set and 5,000-image validation set. Shuffle the training loader, but keep validation order fixed. Model training and loss curves are still planned.',
    code: [
      'from torchvision import datasets, transforms',
      'from torch.utils.data import DataLoader, random_split',
      '',
      'transform = transforms.Compose([',
      '    transforms.ToTensor(),',
      '    transforms.Normalize(',
      '        (0.4914, 0.4822, 0.4465),',
      '        (0.2470, 0.2435, 0.2616),',
      '    ),',
      '])',
      'dataset = datasets.CIFAR10(',
      '    root="./data", train=True, download=True, transform=transform',
      ')',
      'train_set, val_set = random_split(',
      '    dataset, [45000, 5000],',
      '    generator=torch.Generator().manual_seed(42)',
      ')',
      'train_loader = DataLoader(train_set, batch_size=128, shuffle=True)',
      'val_loader = DataLoader(val_set, batch_size=128, shuffle=False)',
    ].join('\n'),
  },
];

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
          An evolving learning notebook about what a neural network does under the hood:
          from inference and architectural interventions to controlled experiments with training.
        </p>

        <div className={styles.actions}>
          <a className={styles.primary} href={notebookUrl} target="_blank" rel="noopener noreferrer">
            <Code2 aria-hidden="true" /> Run notebook in Colab <ArrowUpRight aria-hidden="true" />
          </a>
          <a className={styles.secondary} href={sourceUrl} target="_blank" rel="noopener noreferrer">
            <BookOpen aria-hidden="true" /> View notebook source <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
        <p className={styles.miniNote}>
          One versioned Jupyter notebook · Python / torchvision · CIFAR-10 training experiment in progress
        </p>
      </header>

      <section className={styles.section} aria-labelledby="learning-map">
        <div className={styles.sectionHead}>
          <h2 id="learning-map">Learning map</h2>
          <p>FOUR LAB ENTRIES / GROWING</p>
        </div>
        <div className={styles.lessonGrid}>
          {topics.map(({ number, title, description, icon: Icon, status }) => (
            <article className={styles.lesson} key={number}>
              <header>
                <Icon aria-hidden="true" />
                <span className="eyebrow">{number} / PYTORCH</span>
                <span className={styles.status}>{status}</span>
              </header>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="code-experiments">
        <div className={styles.sectionHead}>
          <h2 id="code-experiments">Code experiments</h2>
          <p>SHORT EXCERPTS / FULL CODE IN COLAB</p>
        </div>
        <div className={styles.exampleList}>
          {examples.map((example) => (
            <article className={styles.example} key={example.number}>
              <div className={styles.exampleIntro}>
                <p className="eyebrow">{example.number}</p>
                <h3>{example.title}</h3>
                <p>{example.description}</p>
              </div>
              <pre><code>{example.code}</code></pre>
            </article>
          ))}
        </div>
        <aside className={styles.noteBox}>
          <h3>What is — and is not — being compared?</h3>
          <p>
            The current activation ablation observes how pretrained logits change after a module
            is swapped. It does not show which activation learns faster. A fair loss-curve
            comparison requires training each condition with controlled initialization, data
            split, optimizer, learning-rate schedule, and evaluation. The CIFAR-10 setup is a
            starting point for that next experiment.
          </p>
        </aside>
      </section>
    </main>
  );
}
