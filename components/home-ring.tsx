'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './home-ring.module.css';

const sections = [
  {
    label: 'Research',
    href: '/research',
    id: 'research',
    description: 'Investigating neural representations, their geometry, and how they evolve across layers.',
  },
  {
    label: 'Coding',
    href: '/coding',
    id: 'coding-ai-engineering',
    description: 'Python, Linux, and algorithm practice.',
  },
  {
    label: 'Blogs & Articles',
    href: '/highlights',
    id: 'notes',
    description: 'Selected articles, technical tutorials, and ideas worth exploring.',
  },
  {
    label: 'Mathematics',
    href: '/math-physics',
    id: 'math-physics',
    description: 'Interactive linear algebra notes, mathematical concepts, and physics explorations.',
  },
  {
    label: 'Machine Learning and Deep Learning Projects',
    href: '/machine-learning-deep-learning-projects',
    id: 'machine-learning-cognitive-science',
    description: 'PyTorch course notebooks, neural network experiments, and Kaggle projects.',
  },
  {
    label: 'About',
    href: '/about',
    id: undefined,
    description: 'The story behind this website, my interests, and the things that inspire me.',
  },
] as const;

export function HomeRing() {
  const [active, setActive] = useState(0);
  const { label: title, description, href } = sections[active];

  return (
    <section className={styles.frame} aria-label="Explore the notebook">
      <div className={styles.ring}>
        <div className={styles.track} aria-hidden="true" />
        {sections.map(({ label, href, id }, index) => (
          <Link
            key={href}
            href={href}
            id={id}
            className={styles.node}
            data-active={active === index}
            onPointerEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
          >
            {label}
          </Link>
        ))}
        <div className={styles.detail}>
          <div aria-live="polite">
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          <Link href={href} className={styles.source} aria-label={`Open ${title}`}>
            Open section <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
