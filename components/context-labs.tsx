"use client";
import { useState, type ReactNode } from "react";
import { ArrowRight, Check, Undo2 } from "lucide-react";
import { KernelLab } from "./context-kernel-lab";
import { FoldLab } from "./context-fold-lab";
import { HierarchyLab } from "./context-hierarchy-lab";
const fmt = (n: number) => n.toLocaleString("en-US");
function BudgetLab() {
  const [turns, setTurns] = useState(8),
    [managed, setManaged] = useState(true),
    [windowSize, setWindowSize] = useState(16000);
  const series = Array.from({ length: turns + 1 }, (_, i) => ({
    raw: 3000 + i * 2000,
    managed: 3000 + (i % 4) * 2000 + Math.floor(i / 4) * 300,
  }));
  const y = (n: number) => 250 - (n / 40000) * 210,
    x = (i: number) => 75 + (i * 690) / 16;
  const current = series[turns][managed ? "managed" : "raw"],
    cumulative = series.reduce((n, p) => n + p[managed ? "managed" : "raw"], 0);
  return (
    <>
      <div className="fs-heading">
        <div>
          <p className="ch-kicker">CONTEXT TRAJECTORY</p>
          <h2>
            A window is a limit.
            <br />
            <em>Work is a running total.</em>
          </h2>
        </div>
        <p>
          Compare the same synthetic sequence of requests. A fold drops resident
          input; it does not erase work already processed.
        </p>
      </div>
      <div className="ch-controls">
        <label>
          Requests{" "}
          <input
            type="range"
            min="0"
            max="16"
            value={turns}
            onChange={(e) => setTurns(Number(e.target.value))}
          />
          <output>{turns + 1}</output>
        </label>
        <label>
          Window
          <select
            value={windowSize}
            onChange={(e) => setWindowSize(Number(e.target.value))}
          >
            <option value={16000}>16K</option>
            <option value={32000}>32K</option>
          </select>
        </label>
        <label>
          <input
            type="checkbox"
            checked={managed}
            onChange={(e) => setManaged(e.target.checked)}
          />
          Use conceptual periodic folds
        </label>
      </div>
      <div className="bt-chart">
        <svg
          viewBox="0 0 820 315"
          role="img"
          aria-label={`Synthetic active input: ${fmt(current)} tokens on request ${turns + 1}; window ${fmt(windowSize)}.`}
        >
          {[0, 10000, 20000, 30000, 40000].map((n) => (
            <g key={n}>
              <line x1="75" x2="765" y1={y(n)} y2={y(n)} className="bt-grid" />
              <text x="62" y={y(n) + 4} textAnchor="end">
                {n / 1000}K
              </text>
            </g>
          ))}
          <line
            x1="75"
            x2="765"
            y1={y(windowSize)}
            y2={y(windowSize)}
            className="bt-limit"
          />
          <text x="765" y={y(windowSize) - 9} textAnchor="end">
            window · {windowSize / 1000}K
          </text>
          <polyline
            className="bt-raw"
            points={series.map((p, i) => `${x(i)},${y(p.raw)}`).join(" ")}
          />
          <polyline
            className="bt-managed"
            points={series.map((p, i) => `${x(i)},${y(p.managed)}`).join(" ")}
          />
          <circle
            cx={x(turns)}
            cy={y(current)}
            r="6"
            className={managed ? "bt-focus-managed" : "bt-focus-raw"}
          />
          {[0, 4, 8, 12, 16].map((i) => (
            <text key={i} x={x(i)} y="277" textAnchor="middle">
              {i + 1}
            </text>
          ))}
          <text x="420" y="304" textAnchor="middle">
            Request number
          </text>
        </svg>
        <div className="bt-legend">
          <span className="raw">Unmanaged</span>
          <span className="managed">Periodic folds</span>
        </div>
      </div>
      <div className="fs-metrics">
        <div>
          <span>THIS REQUEST</span>
          <strong>
            {fmt(current)}
            <small> tokens</small>
          </strong>
          <p>
            {current > windowSize
              ? "Exceeds the chosen window"
              : "Fits inside the chosen window"}
          </p>
        </div>
        <div>
          <span>INPUT PROCESSED SO FAR</span>
          <strong>
            {fmt(cumulative)}
            <small> tokens</small>
          </strong>
          <p>Sum of every plotted request input</p>
        </div>
        <div>
          <span>HISTORY PRODUCED</span>
          <strong>
            {fmt(series[turns].raw)}
            <small> tokens</small>
          </strong>
          <p>Distinct from repeated input processing</p>
        </div>
      </div>
      <p className="ch-muted">
        Synthetic accounting model: +2K new text per turn, a fold every fourth
        turn, +300 summary tokens per cycle. The chart continues hypothetical
        growth past overflow to show the limit; a real request must fit. No cost
        or quality estimate.
      </p>
    </>
  );
}
function GateLab() {
  const [context, setContext] = useState(90000),
    [baseline, setBaseline] = useState(90000),
    [critical, setCritical] = useState(false),
    [log, setLog] = useState(
      "Add growth. A normal nudge still leaves semantic judgment to the model.",
    );
  const floor = context >= 90000,
    growth = context - baseline,
    nudge = floor && growth >= 50000;
  function evaluate() {
    if (!nudge) return;
    if (critical) {
      setLog(
        "Deferred: the current debugging step still uses this detail. No fold ran; the baseline is unchanged.",
      );
      return;
    }
    const next = context - 40000;
    setContext(next);
    setBaseline(next);
    setLog(
      "Model selected a consumed 40K range → kernel validated the fold → post-fold baseline updated.",
    );
  }
  return (
    <>
      <div className="fs-heading">
        <div>
          <p className="ch-kicker">TIMING / THEN JUDGMENT</p>
          <h2>
            The gate asks.
            <br />
            <em>The model decides.</em>
          </h2>
        </div>
        <p>
          Follow one normal cycle in a 200K window. Passing the two checks
          invites evaluation; it does not identify useful information.
        </p>
      </div>
      <div className="ch-controls">
        <button
          onClick={() => setContext((c) => Math.min(190000, c + 10000))}
          disabled={context >= 190000}
        >
          Add 10K context
        </button>
        <label>
          <input
            type="checkbox"
            checked={critical}
            onChange={(e) => setCritical(e.target.checked)}
          />
          Active debugging still needs the candidate
        </label>
        <button
          onClick={() => {
            setContext(90000);
            setBaseline(90000);
            setCritical(false);
            setLog("Cycle reset. Growth since baseline is zero.");
          }}
        >
          <Undo2 size={14} />
          Reset
        </button>
      </div>
      <div className="gt-stage">
        <div className={`gt-node ${floor ? "pass" : ""}`}>
          <span>01 / CONTEXT FLOOR</span>
          <strong>{context / 1000}K / 200K</strong>
          <p>At least 45% of this window</p>
          <small>
            {floor ? <Check size={15} /> : null}
            {floor ? "PASS" : "WAIT"}
          </small>
        </div>
        <ArrowRight className="gt-arrow" />
        <div className={`gt-node ${growth >= 50000 ? "pass" : ""}`}>
          <span>02 / GROWTH CHECK</span>
          <strong>{growth / 1000}K / 50K</strong>
          <p>Since baseline {baseline / 1000}K</p>
          <small>
            {growth >= 50000 ? <Check size={15} /> : null}
            {growth >= 50000 ? "PASS" : "WAIT"}
          </small>
        </div>
        <ArrowRight className="gt-arrow" />
        <div className={`gt-node ${nudge ? "pass" : ""}`}>
          <span>03 / MODEL + DOCTRINE</span>
          <strong>{nudge ? "Evaluate" : "Keep working"}</strong>
          <p>
            {critical ? "Candidate still in use" : "Candidate already consumed"}
          </p>
          <button disabled={!nudge} onClick={evaluate}>
            {critical ? "Defer the fold" : "Choose + fold 40K"}
          </button>
        </div>
      </div>
      <p className="fs-status" role="status">
        {log}
      </p>
      <p className="ch-muted">
        This isolates floor + the pinned 50K growth interval. Production also
        checks compressible mass (including the lower effective-growth path),
        tier mass and hard budgets. The model can initiate compression without a
        nudge. All displayed counts are scenario values.
      </p>
    </>
  );
}
export function ContextLab({ slug, number }: { slug: string; number: number }) {
  const labs: Record<string, () => ReactNode> = {
    "long-context-problem": BudgetLab,
    fold: FoldLab,
    "hierarchical-compression": HierarchyLab,
    "growth-gate": GateLab,
    kernel: KernelLab,
  };
  const Lab = labs[slug];
  if (!Lab) return null;
  return (
    <section
      className={`ch-lab ch-lab-v2 ${slug === "fold" ? "ch-fold-workbench" : ""}`}
    >
      <div className="ch-lab-head">
        <p className="ch-kicker">
          INTERACTIVE STUDY / {String(number).padStart(2, "0")}
        </p>
        <span>Local teaching model</span>
      </div>
      <Lab />
    </section>
  );
}
