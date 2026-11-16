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
    label: 'Coding & AI',
    href: '/coding',
    id: 'coding-ai-engineering',
    description: 'Python, Linux, algorithms, and practical workflows for AI development.',
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
    label: 'Machine Learning',
    href: '/machine-learning-cognitive-science',
    id: 'machine-learning-cognitive-science',
    description: 'Exploring machine learning, neural networks, and the science of machine cognition.',
  },
  {
    label: 'About',
    href: '/about',
    id: undefined,
    description: 'The story behind this website, my interests, and the things that inspire me.',
  },
] as const;

const points = [[18, 46], [23, 42], [26, 50], [29, 37], [31, 46], [35, 41], [36, 49], [41, 44], [43, 36], [53, 25], [58, 19], [62, 27], [64, 15], [68, 21], [71, 30], [73, 17], [78, 23], [82, 13]];

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
          <svg viewBox="0 0 98 64" className={styles.scatter} aria-hidden="true">
            <path d="M8 4v54h85" fill="none" stroke="currentColor" strokeWidth=".7" />
            {points.map(([x, y]) => <circle key={x} cx={x} cy={y} r="1.3" fill="currentColor" />)}
          </svg>
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
