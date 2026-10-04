"use client";
import { useState } from "react";
import { ArrowDown, ArrowRight, RotateCcw, ShieldCheck, GitBranch } from "lucide-react";
const messages = [
  { ref: "m1", raw: "raw-a", text: "Implement authentication", kind: "user" },
  { ref: "m2", raw: "raw-b", text: "Authentication implemented", kind: "assistant" },
  { ref: "m3", raw: "raw-c", text: "skill: load project rules", kind: "tool call" },
  { ref: "m4", raw: "raw-d", text: "Project rules returned", kind: "tool result" },
  { ref: "m5", raw: "raw-e", text: "Authentication tests passed", kind: "assistant" },
  { ref: "m6", raw: "raw-f", text: "Now review the next task", kind: "recent work" },
  { ref: "m7", raw: "raw-g", text: "Current review in progress", kind: "recent work" },
];
const summary = "Authentication implemented; tests passed.";
const stages = [
  { title: "Proposal", api: "Model + doctrine", detail: "The model has already written the summary and selected m1 → m5. The kernel receives both; it does not ask another model to summarize." },
  { title: "Resolve", api: "resolveBoundaries()", detail: "Look up the stable refs in the reference map. m1 → raw-a at index 0; m5 → raw-e at index 4. Resolve the inclusive interval, then adjust pair boundaries." },
  { title: "Protect", api: "filterProtectedToolMessages()", detail: "Remove protected content from both direct and effective coverage. A protected skill call and its paired result stay visible. The requested interval can therefore have holes." },
  { title: "Allocate", api: "allocateBlockId()", detail: "Create b1 with the supplied summary, tier 1 and the legal source IDs. The text is now part of an addressable state object." },
  { title: "Record", api: "state.blocks.push(block)", detail: "Return new state containing active b1. Coverage records which raw messages it consumes. In this first fold there are no child blocks to deactivate. The message view has not changed yet." },
  { title: "Render", api: "next processTurn() → prune", detail: "Use active coverage to hide consumed raw messages and insert b1's summary. Protected and recent messages remain raw. This is the view the Host sends to the next model call." },
];
export function KernelLab() {
  const [step, setStep] = useState(0);
  const [protectedPair, setProtectedPair] = useState(true);
  const coverage = messages.slice(0, 5).filter(m => !protectedPair || (m.ref !== "m3" && m.ref !== "m4"));
  const covered = new Set(coverage.map(m => m.raw));
  const visible = step === 5 ? messages.filter(m => !covered.has(m.raw)) : messages;
  const ids = coverage.map(m => m.raw);
  const block = { blockId: "b1", summary, tier: 1, directMessageIds: ids, effectiveMessageIds: ids, directBlockIds: [], active: true };
  return <div className="kl-study">
    <div className="fs-heading"><div><p className="ch-kicker">ONE COMPRESS REQUEST</p><h2>Watch the state change.<br /><em>Then watch the view change.</em></h2></div><p>Follow m1 → m5. Compare the block's source coverage with the messages the next model actually sees.</p></div>
    <div className="kl-proposal"><span>MODEL-WRITTEN INPUT</span><code>compress(m1 → m5)</code><p>“{summary}”</p></div>
    <div className="kl-controls"><label><input type="checkbox" checked={protectedPair} onChange={e => { setProtectedPair(e.target.checked); setStep(0); }} /><ShieldCheck size={16} /> Protect the skill call + result (m3 / m4)</label><button onClick={() => { setStep(0); setProtectedPair(true); }}><RotateCcw size={14} /> Reset</button></div>
    <nav className="kl-steps" aria-label="Compression execution stages">{stages.map((s, i) => <button key={s.title} aria-pressed={step === i} onClick={() => setStep(i)}><small>{String(i).padStart(2, "0")}</small><strong>{s.title}</strong></button>)}</nav>
    <div className="kl-explanation" aria-live="polite"><div><p className="ch-kicker">{step === 5 ? "PATH B / PROCESS TURN" : step ? "PATH A / APPLY COMPRESSION" : "BEFORE THE KERNEL"}</p><h3>{stages[step].title}</h3><code>{stages[step].api}</code></div><p>{stages[step].detail}</p></div>
    <div className="kl-worlds">
      <section><p className="ch-kicker">{step === 5 ? "OUTPUT / NEXT WORKING VIEW" : "INPUT / MESSAGE VIEW"}</p><h3>{step === 5 ? "Covered raw content is hidden." : "Raw messages are still visible."}</h3>
        {step === 5 ? <div className="kl-summary"><strong>b1 · active summary</strong><p>{summary}</p><small>Inserted at a safe source anchor</small></div> : null}
        <div className="kl-messages">{visible.map(m => {
          const protectedMessage = protectedPair && (m.ref === "m3" || m.ref === "m4");
          return <div key={m.raw} className={protectedMessage ? "kl-protected" : step >= 2 && covered.has(m.raw) ? "kl-covered" : ""}><code>{m.ref}</code><span>{m.text}<small>{step === 1 ? `${m.raw} · index ${messages.indexOf(m)}` : protectedMessage ? "protected · preserved raw" : step >= 2 && covered.has(m.raw) ? "legal coverage · raw until render" : m.kind}</small></span></div>;
        })}</div><p className="kl-caption">{step === 5 ? `${coverage.length} covered originals hidden; ${visible.length} raw messages remain.` : "m6 / m7 represent recent work outside the requested range."}</p>
      </section>
      <section className="kl-state"><p className="ch-kicker">{step < 3 ? "RANGE / REFERENCE MAP" : "OUTPUT / COMPRESSION STATE"}</p><h3>{step < 2 ? "Make messages addressable." : step === 2 ? "Requested ≠ effective." : "A summary with identity."}</h3>
        {step < 3 ? <><div className="kl-ref-map">{messages.slice(0, 5).map(m => <div key={m.raw}><code>{m.ref}</code><ArrowRight size={13} /><code>{m.raw}</code><span>{step >= 2 && !covered.has(m.raw) ? "excluded" : "in range"}</span></div>)}</div><p className="kl-caption">{step >= 2 ? `Effective refs: ${coverage.map(m => m.ref).join(", ")}. Stored coverage uses the raw IDs.` : "Stable refs address messages; raw IDs identify the underlying objects."}</p></> : <><pre aria-label="Schematic block state">{JSON.stringify(block, null, 2)}</pre><p className="kl-caption">{step === 3 ? "Candidate block allocated. Next: add it to state." : "b1 is recorded in state.blocks. Coverage drives the next view; no per-message consumed flag is needed."}</p></>}
      </section>
    </div>
    <div className="kl-footer"><button disabled={step === 0} onClick={() => setStep(s => Math.max(0, s - 1))}>← Previous step</button><p role="status">{step + 1} / {stages.length} · {step < 4 ? "Block state is being prepared" : step === 4 ? "State updated · view unchanged" : "New working view ready"}</p><button disabled={step === 5} onClick={() => setStep(s => Math.min(5, s + 1))}>Next step <ArrowRight size={14} /></button></div>
    <section className="kl-lineage"><div><p className="ch-kicker"><GitBranch size={14} /> SAME MECHANISM / HIGHER TIER</p><h3>Blocks can be sources too.</h3><p>A later model proposal folds b1 + b2 into b3. The kernel records child links and transitive original coverage.</p></div><div className="kl-tree"><strong>b3 · T2 · active</strong><ArrowDown size={18} /><div><span><b>b1 · T1 · inactive</b><small>{coverage.map(m => m.ref).join(", ")}</small></span><span><b>b2 · T1 · inactive</b><small>another consumed range</small></span></div><p>Children stay in the graph. The parent takes their place in the working view.</p></div></section>
    <section className="kl-host"><p className="ch-kicker">PERSISTENCE BELONGS TO THE HOST</p><div><span>Load state S</span><ArrowRight size={16} /><strong>Kernel: (messages, S) → (view, S′)</strong><ArrowRight size={16} /><span>Save S′ · send view</span></div><p>The Host passes S′ back on the next turn. The kernel performs no storage I/O and never calls the LLM.</p></section>
    <p className="kl-caption">Illustrative local trace, not a kernel invocation. Other validation rules and optional transformations are explained in the notes.</p>
  </div>;
}
