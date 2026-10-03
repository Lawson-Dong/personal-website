import type { ReactNode } from "react";
import {
  ArrowDown,
  ArrowRight,
  Archive,
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
const diagrams: Record<
  string,
  { label: string; title: string; Art: () => ReactNode }
> = {
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
