'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './home-ring.module.css';

const sections = [
  {
    label: 'Research', href: '/research', id: 'research',
    previews: [
      ['Representation analysis', 'How do representations change across layers?', '/research'],
      ['Model–brain correspondence', 'Comparing ResNet representations with early visual cortex and inferotemporal cortex.', '/research'],
      ['Learning mechanics', 'What if neural-network training can be studied as a discrete dynamical system?', '/research'],
    ],
  },
  {
    label: 'Coding & AI', href: '/coding', id: 'coding-ai-engineering',
    previews: [
      ['Python Foundation', 'Build up from Python basics to collections, methods, and classes.', '/coding/python-foundation'],
      ['Context Engineering', 'Interactive studies of context management and the systems around language models.', '/coding/ai-engineering/context-harness'],
      ['LeetCode', 'Algorithm solutions and notes on linked lists, sorting, and binary search.', '/coding/leetcode'],
    ],
  },
  {
    label: 'Blogs & Articles', href: '/highlights', id: 'notes',
    previews: [
      ['AI 2027', 'A scenario exploring how artificial intelligence might evolve by 2027.', '/highlights'],
      ['AI 2027 · Safety and governance', 'What challenges could follow the race toward increasingly capable AI?', '/highlights'],
    ],
  },
  {
    label: 'Mathematics', href: '/math-physics', id: 'math-physics',
    previews: [
      ['Linear Algebra', 'Interactive visualizations make linear algebra concepts easier to inspect.', '/math-physics/math/linear-algebra/fun-visualization'],
      ['Lecture notes', 'Worked notes on Gaussian elimination and elementary row operations.', '/math-physics/math/linear-algebra/lecture-note'],
      ['Bessel’s Correction', 'A statistics note on sample variance and Bessel’s correction.', '/math-physics/math/statistics'],
    ],
  },
  {
    label: 'Machine Learning', href: '/machine-learning-cognitive-science', id: 'machine-learning-cognitive-science',
    previews: [
      ['PyTorch Experience', 'Hands-on notebooks on deep learning experiments and PyTorch workflows.', '/coding/pytorch-experience'],
      ['Semantic composition', 'How do component concepts combine inside CLIP’s representation space?', '/research'],
      ['Optimizer trajectories', 'Following SGD, momentum SGD, and Adam through parameter space.', '/research'],
    ],
  },
  {
    label: 'About', href: '/about', id: undefined,
    previews: [
      ['About the notebook', 'A place to connect research questions, programming foundations, and things worth reading.', '/about'],
      ['I love girl bands', 'MyGO!!!!! and Girls Band Cry have a special place in this corner of the web.', '/about'],
      ['A quieter corner', 'Music, fragments, and a quieter side of the notebook.', '/lost'],
    ],
  },
] as const;

const selectionKey = 'lawson-home-ring-previews';
const initialSelection = sections.map(() => 0);
let pageSelection: number[] | undefined;

function pickPreviews() {
  if (pageSelection) return pageSelection;

  let previous: unknown;
  try {
    previous = JSON.parse(sessionStorage.getItem(selectionKey) ?? 'null');
  } catch {
    previous = null;
  }

  const last = Array.isArray(previous) ? previous : initialSelection;
  pageSelection = sections.map(({ previews }, index) => {
    const prior = last[index];
    const hasPrior = Number.isInteger(prior) && prior >= 0 && prior < previews.length;
    const draw = Math.floor(Math.random() * (previews.length - Number(hasPrior)));
    return hasPrior && draw >= prior ? draw + 1 : draw;
  });

  try {
    sessionStorage.setItem(selectionKey, JSON.stringify(pageSelection));
  } catch {
    // A fresh selection still works when storage is unavailable.
  }
  return pageSelection;
}

const points = [[18, 46], [23, 42], [26, 50], [29, 37], [31, 46], [35, 41], [36, 49], [41, 44], [43, 36], [53, 25], [58, 19], [62, 27], [64, 15], [68, 21], [71, 30], [73, 17], [78, 23], [82, 13]];

export function HomeRing() {
  const [active, setActive] = useState(0);
  const [selection, setSelection] = useState(initialSelection);

  useEffect(() => {
    setSelection(pickPreviews());
  }, []);

  const [title, description, source] = sections[active].previews[selection[active]];

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
          <Link href={source} className={styles.source} aria-label={`Open source for ${title}`}>
            Read the source <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
