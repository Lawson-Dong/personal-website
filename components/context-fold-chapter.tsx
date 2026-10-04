import { MathTex } from "./math";
import styles from "./context-fold-chapter.module.css";

const messages = ["user request", "assistant reasoning", "tool call", "tool result", "follow-up", "code output", "another tool result", "intermediate conclusion", "recent work", "current work"];
function Messages({ start, end }: { start: number; end: number }) {
  return <div className={styles.messages}>{Array.from({ length: end - start + 1 }, (_, i) => <span key={start + i}>m{start + i}</span>)}</div>;
}
function Digest({ name = "Digest", second = false }: { name?: string; second?: boolean }) {
  return <div className={styles.digest}><strong>{name}</strong><p>{second ? "Added regression tests and verified the routing behavior." : "Fixed the routing bug. Literal routes now run before dynamic routes. Tests passed."}</p></div>;
}
function Chunk({ start, end, name, second = false }: { start: number; end: number; name: string; second?: boolean }) {
  return <div className={styles.chunk}><Messages start={start} end={end} /><div className={styles.arrow} aria-hidden="true">↓</div><Digest name={name} second={second} /><p className={styles.caption}>{name} = digest of m{start}–m{end}</p></div>;
}
export function ContextFoldChapter() {
  return <article className={styles.chapter}>
    <section>
      <h2>1. Start with raw messages</h2>
      <p>A continuous stretch of context can be written as m1 through m10. These are simply the original messages, in order.</p>
      <figure className={styles.figure}><Messages start={1} end={10} /><figcaption>Ten original messages, arranged in conversation order.</figcaption></figure>
      <div className={styles.tableWrap}><table><thead><tr><th>Message</th><th>Example content</th></tr></thead><tbody>{messages.map((message, i) => <tr key={message}><td><code>m{i + 1}</code></td><td>{message}</td></tr>)}</tbody></table></div>
      <p>As the task continues, raw messages keep accumulating: m1, m2, m3 … m100 … m1000. The model does not need every historical detail to stay in its current context.</p>
    </section>
    <section>
      <h2>2. Digest</h2>
      <p>Suppose m1–m4 describe one completed stretch of work. We can compress the important information into a shorter account. This compressed content is called a <strong>digest</strong>.</p>
      <figure className={styles.figure}><Messages start={1} end={4} /><div className={styles.arrow} aria-hidden="true">↓</div><Digest /><figcaption>Raw messages → digest.</figcaption></figure>
      <p>A digest keeps the main information needed to continue working, while leaving out details that no longer need to stay in context.</p>
    </section>
    <section>
      <h2>3. Chunked compression</h2>
      <p><strong>We do not compress all of m1–m10 into one digest.</strong> Instead, divide the history into local stretches and compress each completed stretch separately.</p>
      <figure className={styles.figure}><div className={styles.columns}><Chunk start={1} end={4} name="d1" /><Chunk start={5} end={8} name="d2" second /><div className={styles.recent}><Messages start={9} end={10} /><strong>Recent work</strong><p>Still active. Keep these messages raw.</p></div></div><figcaption>Two completed stretches become two independent digests. Recent work stays raw.</figcaption></figure>
      <div className={styles.equations}><MathTex tex={String.raw`[m_1\dots m_4]\rightarrow d_1`} display /><MathTex tex={String.raw`[m_5\dots m_8]\rightarrow d_2`} display /></div>
      <figure className={styles.figure}><div className={styles.after}><span className={styles.digestChip}>d1</span><span className={styles.digestChip}>d2</span><Messages start={9} end={10} /></div><figcaption>The resulting context: d1, d2, m9, m10.</figcaption></figure>
      <p>This keeps the work from different stages independent. The two completed stretches are not merged into one global digest.</p>
    </section>
    <section>
      <h2>4. Source Reference</h2>
      <p>A digest alone is not enough. Suppose d1 says “Fixed the routing bug. Tests passed.” Later, the model asks: <strong>“What exact timeout value was used?”</strong> That detail may be missing from the digest.</p>
      <p>Each compressed block therefore also records <strong>which original messages it came from</strong>. This record is its <strong>source reference</strong>.</p>
      <figure className={styles.figure}><div className={styles.references}>{[{ name: "d1", start: 1, end: 4 }, { name: "d2", start: 5, end: 8 }].map(({ name, start, end }) => <div className={styles.reference} key={name}><Digest name={name} second={name === "d2"} /><div className={styles.sourceLabel}>Source reference: m{start}–m{end}</div><div className={styles.arrow} aria-hidden="true">↓</div><div className={styles.original}><strong>Original source</strong><Messages start={start} end={end} /></div></div>)}</div><figcaption>d1 points back to m1–m4; d2 points back to m5–m8.</figcaption></figure>
      <p>When an exact detail is needed, follow the reference to read the original content. The original messages remain available; the digest does not have to contain every detail.</p>
    </section>
    <section>
      <h2>Fold</h2>
      <p>Now we can define the complete result. A folded block contains both the compressed content and a reference to its source.</p>
      <div className={styles.formula}><MathTex tex={String.raw`\boxed{\text{Fold Block}=\text{Digest}+\text{Source Reference}}`} display /></div>
      <figure className={styles.figure}>
        <p className={styles.label}>Before</p><div className={styles.columns}><Messages start={1} end={4} /><Messages start={5} end={8} /><Messages start={9} end={10} /></div>
        <div className={styles.arrow}>↓ <span>Fold</span></div>
        <p className={styles.label}>After</p><div className={styles.columns}><div className={styles.block}><strong>Block 1</strong><Digest name="Digest · d1" /><div className={styles.sourceLabel}>Source reference: m1–m4</div></div><div className={styles.block}><strong>Block 2</strong><Digest name="Digest · d2" second /><div className={styles.sourceLabel}>Source reference: m5–m8</div></div><div className={styles.recent}><Messages start={9} end={10} /><strong>Recent work stays raw</strong></div></div>
        <figcaption>Each local stretch gets its own compressed block and its own path back to the original messages.</figcaption>
      </figure>
      <div className={styles.formula}><MathTex tex={String.raw`\text{Fold}=\text{chunked compression}+\text{source reference}`} display /></div>
      <p>Fold reduces active context and keeps a path back to the original context.</p>
      <p className={styles.sequence}>message → digest → chunked compression → source reference → Fold block</p>
    </section>
  </article>;
}
