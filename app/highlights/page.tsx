import styles from './highlights.module.css';

export const metadata = { title: 'Highlighting Blogs & Articles' };

const highlights = [
  {
    title: 'AI 2027',
    category: 'AI / FUTURES',
    url: 'https://ai-2027.com/',
    description:
      'A detailed scenario exploring how artificial intelligence might evolve by 2027. It examines the race toward increasingly capable AI, along with the safety and governance challenges that could follow. A thought-provoking forecast, not a certainty.',
  },
];

export default function Highlights() {
  return (
    <main className="section shell empty-module">
      <p className="eyebrow">CURATED READING / 01</p>
      <h1 className="portal-title">Highlighting<br/><em>Blogs &amp; Articles.</em></h1>
      <p className={styles.intro}>A collection of interesting ideas, perspectives, and articles worth revisiting.</p>
      <div className={styles.grid}>
        {highlights.map((item, index) => (
          <a
            key={item.url}
            className={styles.card}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.title + ' — opens in a new tab'}
          >
            <div className={styles.topline}>
              <span>{String(index + 1).padStart(2, '0')} / {item.category}</span>
              <span className={styles.external} aria-hidden="true">↗</span>
            </div>
            <h2 className={styles.title}>{item.title}</h2>
            <p className={styles.description}>{item.description}</p>
            <div className={styles.footer}>
              <span>Explore article</span>
              <span className={styles.arrow} aria-hidden="true">→</span>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
