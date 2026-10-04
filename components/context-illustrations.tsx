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
        <p className="ch-kicker">SEMANTIC PRIORITY</p>
        <h3>
          Keep enough
          <br />
          to continue correctly.
        </h3>
        <p>The task determines what matters.</p>
      </div>
      <ol>
        {[
          ["Intent + constraints", "What must remain true?"],
          ["Decisions + rationale", "What did we choose, and why?"],
          [
            "Exact artifacts + errors",
            "Which paths, values or unresolved details matter?",
          ],
          [
            "Conclusions + lessons",
            "What is worth keeping after the verbose trace is consumed?",
          ],
        ].map(([a, b], i) => (
          <li key={a}>
            <span>0{i + 1}</span>
            <div>
              <strong>{a}</strong>
              <p>{b}</p>
            </div>
          </li>
        ))}
      </ol>
      <footer>
        The model judges meaning. The kernel separately enforces structural
        protections.
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
  const messages = ["m1","m2","m3","m4","m5","m6","m7","m8","m9","m10"];
  return (
    <div className="ci-fold-map">
      <p className="ch-muted">
        The same m1–m10 history from Fold. Recovery reads the path that compression preserved.
      </p>

      <div className="ci-fold-timeline">
        <section className="ci-fold-original">
          <FileText size={20} />
          <strong>Raw messages</strong>
          <div className="ci-pages">
            {messages.map((m) => <code key={m}>{m}</code>)}
          </div>
          <span>Original context is retained outside the compact working view.</span>
        </section>

        <section className="ci-fold-digest">
          <Layers size={20} />
          <strong>Fold keeps source references</strong>
          <code>d1 → m1–m4</code>
          <code>d2 → m5–m8</code>
          <span>m9–m10 can remain recent and raw.</span>
        </section>

        <section className="ci-fold-recent">
          <GitBranch size={20} />
          <strong>Hierarchy forms lineage</strong>
          <code>h1 → d1 → m1–m4</code>
          <code>h1 → d2 → m5–m8</code>
          <span>Vertical compression carries the source path upward.</span>
        </section>
      </div>

      <div className="ci-fold-next">
        <ScanLine size={20} />
        <div>
          <strong>Recovery follows the path back down</strong>
          <p>
            Need the exact detail from m3? Start from h1, follow its reference to d1,
            then follow d1 to m3 and read the retained original.
          </p>
          <code>h1 → d1 → m3 → retained source</code>
        </div>
      </div>

      <p className="ch-muted">
        Fold creates source references. Hierarchical Compression turns them into lineage.
        Recovery follows that lineage back to the retained source.
      </p>
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
    label: "JUDGMENT, MADE CONCRETE",
    title: "Meaning deserves the space.",
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
