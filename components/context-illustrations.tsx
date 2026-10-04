import type { ReactNode } from "react";
import {
  ArrowDown,
  ArrowRight,
  Archive,
  GitBranch,
  FileText,
  Layers,
  ScanLine,
} from "lucide-react";
function ViewAndSource() {
  return (
    <div className="ci-dual">
      <section className="ci-store">
        <p className="ch-kicker">
          <Archive size={15} /> STORED HISTORY
        </p>
        <h3>Everything retained.</h3>
        <div className="ci-pages">
          {[
            "Task intent",
            "Earlier file read",
            "Past decision",
            "Consumed test log",
            "Current question",
          ].map((s, i) => (
            <div key={s}>
              <code>m0000{i + 1}</code>
              <span>{s}</span>
            </div>
          ))}
        </div>
        <p>
          Persistence keeps sources available.
          <br />
          It does not put them into attention.
        </p>
      </section>
      <div className="ci-link">
        <ArrowRight />
        <span>select or retrieve</span>
      </div>
      <section className="ci-active">
        <p className="ch-kicker">
          <ScanLine size={15} /> REQUEST INPUT
        </p>
        <h3>What the model sees.</h3>
        <div className="ci-pages">
          {["Task intent", "Relevant past decision", "Current question"].map(
            (s, i) => (
              <div key={s}>
                <span>{s}</span>
                <small>{i === 1 ? "retrieved" : "included"}</small>
              </div>
            ),
          )}
        </div>
        <p>
          An absent source cannot directly support the answer until it is
          brought into this view.
        </p>
      </section>
    </div>
  );
}
function Workspace() {
  return (
    <div className="ci-workspace">
      <div className="ci-big-history">
        <Archive size={36} strokeWidth={1} />
        <h3>Growing source history</h3>
        <span>saved once / addressable later</span>
        <div className="ci-history-bars" aria-hidden="true">
          {Array.from({ length: 18 }, (_, i) => (
            <i key={i} style={{ height: 20 + (i % 5) * 9 }} />
          ))}
        </div>
      </div>
      <div className="ci-link">
        <ArrowRight />
        <span>select · fold · read</span>
      </div>
      <div className="ci-window">
        <p className="ch-kicker">ONE ACTIVE REQUEST</p>
        <div>
          <Layers size={17} />
          <span>Earlier digests</span>
        </div>
        <div>
          <FileText size={17} />
          <span>Recent raw work</span>
        </div>
        <div className="ci-on-demand">
          <ScanLine size={17} />
          <span>Source reads on demand</span>
        </div>
        <footer>A finite attention window</footer>
      </div>
    </div>
  );
}
function RewriteScope() {
  return (
    <div className="ci-comparison">
      <section>
        <p className="ch-kicker">ROLLING SUMMARY / EXAMPLE</p>
        <h3>Rewrite the accumulated account.</h3>
        <div className="ci-equation">
          <span>S₁</span>
          <b>+</b>
          <span>new range</span>
        </div>
        <ArrowDown className="ci-down" />
        <div className="ci-summary revised">
          <strong>S₂</strong>
          <span>previous account rewritten</span>
        </div>
        <p>
          Older meaning participates in the next rewrite. Repeated abstraction
          can lose detail.
        </p>
      </section>
      <section>
        <p className="ch-kicker">LOCAL FOLDS / BILLION-CONTEXT</p>
        <h3>Give the new range its own digest.</h3>
        <div className="ci-equation">
          <span>b1</span>
          <b>+</b>
          <span>new range</span>
        </div>
        <ArrowDown className="ci-down" />
        <div className="ci-result-pair">
          <div className="ci-summary">
            <strong>b1</strong>
            <span>unchanged</span>
          </div>
          <div className="ci-summary revised">
            <strong>b2</strong>
            <span>new digest</span>
          </div>
        </div>
        <p>
          A local fold leaves unrelated blocks alone. Higher-tier distillation
          can later rewrite selected blocks.
        </p>
      </section>
      <footer>
        Scope comparison, not a claim about every product. Both approaches may
        retain originals and provide retrieval.
      </footer>
    </div>
  );
}
function DoctrineMap() {
  return (
    <div className="ci-doctrine">
      <div>
        <p className="ch-kicker">ONE SEMANTIC QUESTION</p>
        <h3>
          Has this information
          <br />
          finished its job?
        </h3>
        <p>Judge it relative to the current task step.</p>
      </div>
      <ol>
        <li>
          <span>01</span>
          <div>
            <strong>Still directly needed?</strong>
            <p>Keep the information raw in the working context.</p>
          </div>
        </li>
        <li>
          <span>02</span>
          <div>
            <strong>No longer directly needed?</strong>
            <p>It has been consumed and can become a fold candidate.</p>
          </div>
        </li>
        <li>
          <span>03</span>
          <div>
            <strong>Then preserve what survives.</strong>
            <p>Keep the result, constraints, exact load-bearing details and source references.</p>
          </div>
        </li>
      </ol>
      <footer>
        Old but still needed → keep. Recent but already consumed → compress.
      </footer>
    </div>
  );
}
function FoldSourceMap() {
  return (
    <div className="ci-fold-map">
      <p className="ch-muted">Horizontal compression · independent local folds along the conversation timeline</p>
      <div className="ci-fold-timeline">
        {[
          { refs: "m00002–m00007", name: "b1", text: "Routing decision + test outcome" },
          { refs: "m00008–m00012", name: "b2", text: "Later completed navigation work" },
        ].map(({ refs, name, text }) => (
          <section className="ci-fold-range" key={name}>
            <div className="ci-fold-original"><Archive size={18} /><strong>Retained original messages</strong><code>{refs}</code><span>Exact source text stays available</span></div>
            <div className="ci-fold-action"><ArrowDown size={18} /><span>compress · write digest + record coverage</span></div>
            <div className="ci-fold-digest"><Layers size={18} /><strong>{name} · tier 1 digest</strong><span>{text}</span><code>covers: {refs}</code></div>
            <p className="ci-fold-read"><ScanLine size={16} /><span>Need a detail? Follow {name}’s coverage → read the retained original.</span></p>
          </section>
        ))}
        <aside className="ci-fold-recent"><FileText size={20} /><strong>Current work</strong><span>Recent raw messages remain in view</span></aside>
      </div>
      <div className="ci-fold-next"><GitBranch size={20} /><div><strong>Next: vertical compression</strong><p>b1 + b2 → a tier-2 parent with child links. The source lineage continues through both blocks.</p><a href="/coding/ai-engineering/context-harness/billion-context/hierarchical-compression">Explore Hierarchical Compression →</a></div></div>
      <p className="ch-muted">Conceptual completed ranges. Real folds enforce protected zones and tool boundaries. Recovery reads retained sources; the digest stays folded.</p>
    </div>
  );
}
function RecoveryMap() {
  return (
    <div className="ci-recovery-map">
      <p className="ch-muted">The same m1–m10 history from Fold. Arrows below point from a summary to its retained sources.</p>
      <div className="ci-recovery-groups">
        {[{ name: "S1", ids: [1, 2, 3, 4] }, { name: "S2", ids: [5, 6, 7] }, { name: "Recent raw context", ids: [8, 9, 10] }].map(({ name, ids }) => (
          <section key={name} className="ci-recovery-group">
            <div className="ci-recovery-messages">{ids.map(id => <code key={id} className={id === 3 ? "ci-recovery-target" : undefined}>m{id}</code>)}</div>
            <span className="ci-recovery-direction">{name === "Recent raw context" ? "kept in the working view" : "↓ Fold preserves sources"}</span>
            <strong>{name}</strong>
            {name !== "Recent raw context" && <small>sources: [{ids.map(id => `m${id}`).join(", ")}]</small>}
          </section>
        ))}
      </div>
      <div className="ci-recovery-parent"><Layers size={20} /><strong>H1</strong><code>sources: [S1, S2]</code><p>Hierarchical Compression folds S1 and S2 into H1 while preserving their source relationships.</p></div>
      <div className="ci-recovery-lineage" aria-label="Source lineage: H1 points to S1, which points to m1 through m4, and S2, which points to m5 through m7">
        <p className="ch-kicker">THE PRESERVED LINEAGE</p>
        <div><code>H1</code><span>→</span><code>S1</code><span>→</span><code>m1 · m2 · <strong>m3</strong> · m4</code></div>
        <div><code>H1</code><span>→</span><code>S2</code><span>→</span><code>m5 · m6 · m7</code></div>
      </div>
      <div className="ci-recovery-read"><ScanLine size={22} /><div><strong>Need the exact command originally mentioned in m3?</strong><p>Follow H1’s reference to S1, resolve S1’s reference to m3, then retrieve the retained original message.</p><div className="ci-recovery-route"><code>H1</code><span>→</span><code>S1</code><span>→</span><code>m3</code><span>→</span><strong>original raw content</strong></div></div></div>
      <p className="ch-muted">S1, S2 and H1 are teaching labels for summary blocks. The route illustrates provenance; an implementation may use recorded original-message coverage or cached originals to retrieve directly.</p>
    </div>
  );
}

const diagrams: Record<
  string,
  { label: string; title: string; Art: () => ReactNode }
> = {
  recovery: {
    label: "SOURCE LINEAGE / RECOVERY",
    title: "Follow the references back to m3.",
    Art: RecoveryMap,
  },
  fold: {
    label: "SOURCE INDEX / HORIZONTAL COMPRESSION",
    title: "Fold the view. Keep the way back.",
    Art: FoldSourceMap,
  },
  "active-context": {
    label: "STORAGE ≠ ATTENTION",
    title: "Available later. Visible now.",
    Art: ViewAndSource,
  },
  "bounded-window": {
    label: "THE WORKING SET",
    title: "A bounded view of a growing history.",
    Art: Workspace,
  },
  "incremental-fold": {
    label: "REWRITE SCOPE",
    title: "One new range. One local digest.",
    Art: RewriteScope,
  },
  "compression-doctrine": {
    label: "TASK-RELATIVE JUDGMENT",
    title: "Compress information when it has finished its job.",
    Art: DoctrineMap,
  },
};
export function ContextIllustration({ slug }: { slug: string }) {
  const item = diagrams[slug];
  if (!item) return null;
  const Art = item.Art;
  return (
    <figure className="ch-visual ci-figure">
      <figcaption>
        <p className="ch-kicker">VISUAL STUDY / {item.label}</p>
        <h2>{item.title}</h2>
      </figcaption>
      <Art />
    </figure>
  );
}
