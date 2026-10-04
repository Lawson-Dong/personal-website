"use client";
import { useState, type FormEvent } from "react";
import { Archive, ArrowDown, ArrowRight, GitBranch, Search, RotateCcw } from "lucide-react";
import { MathTex } from "./math";
import { recoveryBlocks, recoveryMessages, recoveryRoot, searchRecovery, recoverItems, type RecoveryMode } from "@/lib/context-recovery";

const operations = [
  { mode: "retrieve" as const, title: "Retrieve one message", label: "acp_retrieve", description: "One exact original. Requires a retained, addressable source and the configured content store." },
  { mode: "one" as const, title: "Decompress one level", label: "decompress", description: "Direct sources; nested active child blocks remain summaries." },
  { mode: "full" as const, title: "Decompress all levels", label: "decompress · full", description: "Recurse through child blocks to the retained originals." },
];
const lifecycle = [
  ["Work", "Raw messages accumulate while the agent works."],
  ["Evaluate", "The gate invites evaluation; the model and doctrine judge what is consumed. The model can also initiate a fold."],
  ["Fold", "The kernel validates structure. A model-written digest replaces selected sources in the working view."],
  ["Retain", "The source graph records coverage. Recovery also needs the original content to remain available."],
  ["Recover", "Locate relevant history, choose the needed fidelity, then read the returned sources to resume work."],
];
export function RecoveryLab() {
  const [folded, setFolded] = useState(false);
  const [query, setQuery] = useState("timeout");
  const [searched, setSearched] = useState<string | null>(null);
  const [target, setTarget] = useState(recoveryRoot.id);
  const [message, setMessage] = useState("m00437");
  const [mode, setMode] = useState<RecoveryMode>("retrieve");
  const [restored, setRestored] = useState<{ target: string; mode: RecoveryMode } | null>(null);
  const [retained, setRetained] = useState(true);
  const [step, setStep] = useState(0);
  const hits = searched === null ? [] : searchRecovery(searched);
  const items = restored && retained ? recoverItems(restored.target, restored.mode) : [];
  function reset() {
    setFolded(false); setQuery("timeout"); setSearched(null); setTarget(recoveryRoot.id);
    setMessage("m00437"); setMode("retrieve"); setRestored(null); setRetained(true); setStep(0);
  }
  function search(e: FormEvent) { e.preventDefault(); setSearched(query); }
  function choose(id: string) { setTarget(id); setRestored(null); }
  return <div className="rc-study">
    <div className="fs-heading">
      <div><p className="ch-kicker">LESS IN VIEW. STILL REACHABLE.</p><h2>Compressed does not<br /><em>mean forgotten.</em></h2></div>
      <p>Fold a small history. Search its digests. Follow a source link to read the exact error the summary left out.</p>
    </div>
    <div className="rc-toolbar">
      <button className="rc-action" onClick={() => { setFolded(true); setStep(2); }} disabled={folded}>Fold history <ArrowRight size={15} /></button>
      <button onClick={reset}><RotateCcw size={14} /> Reset study</button>
      <span>Synthetic example · 6 representative messages · no LLM call</span>
    </div>
    <div className="rc-worlds">
      <section className="rc-resident"><p className="ch-kicker">RESIDENT / WHAT THE MODEL SEES NOW</p>
        <div className="rc-pinned">System instructions + current task</div>
        {folded ? <article className="rc-digest"><small>TIER 2 · ACTIVE DIGEST</small><strong>{recoveryRoot.id} · Migration phase</strong><p>{recoveryRoot.text}</p><span>Sources: b017 + b018</span></article>
          : <div className="rc-messages">{recoveryMessages.map(m => <div key={m.id}><code>{m.id}</code><span>{m.title}</span></div>)}</div>}
        <div className="rc-pinned">Recent raw context · current question</div>
        <p className="rc-caption">{folded ? "The summary replaces earlier detail in the working view." : "Before folding, the earlier detail is visible."}</p>
        {restored ? <div id="rc-evidence" className="rc-returned" aria-live="polite"><p className="ch-kicker">RETURNED SOURCE / WORKING EVIDENCE</p>
          {retained ? <><strong>{items.length} {items.length === 1 ? "item" : "items"} returned</strong>{items.map(item => <article key={item.id}><code>{item.id} · {item.title}</code><pre>{item.text}</pre></article>)}<p>The active digest stays in place. Returned text supplies the extra detail.</p></>
            : <p>Originals unavailable. The digest and its IDs cannot reconstruct the missing text.</p>}
        </div> : null}
      </section>
      <section className="rc-retained"><p className="ch-kicker"><Archive size={14} /> RETAINED / WHAT THE SYSTEM CAN REACH</p>
        <h3>Summaries + lineage + sources</h3>
        <p className="rc-caption">{folded ? "Follow the graph. Select a block to set the recovery scope." : "Fold first to inspect the summary graph."}</p>
        {folded ? <div className="rc-tree">
          <button aria-pressed={target === recoveryRoot.id} onClick={() => choose(recoveryRoot.id)} title="Tier 2 covers b017 and b018, with all six originals reachable below."><GitBranch size={16} /><span><strong>b021 · Migration phase</strong><small>T2 → b017 + b018</small></span></button>
          <div className="rc-branches">{recoveryBlocks.map(b => <div key={b.id}>
            <button aria-pressed={target === b.id} onClick={() => choose(b.id)} title={b.summary}><span><strong>{b.id} · {b.title}</strong><small>T1 · {b.span}</small></span></button>
            <div className="rc-leaves">{b.sourceIds.map(id => <button key={id} aria-pressed={mode === "retrieve" && message === id} onClick={() => { setMode("retrieve"); setMessage(id); setTarget(b.id); setRestored(null); }} title={recoveryMessages.find(m => m.id === id)?.text}>{id}</button>)}</div>
          </div>)}</div>
        </div> : <div className="rc-source-bank"><Archive size={26} /><strong>6 originals retained</strong><span>Folding changes visibility, not the stored text.</span></div>}
        <label className="rc-retention"><input type="checkbox" checked={retained} onChange={e => { setRetained(e.target.checked); setRestored(null); }} /> Keep original content available</label>
        <p className="rc-caption">{retained ? "Lineage points to stored originals." : "A pointer alone is insufficient: the source text is unavailable."}</p>
      </section>
    </div>
    <div className="rc-search-section">
      <div><p className="ch-kicker">01 / LOCATE</p><h3>Search summaries</h3><p>Try <button className="rc-word" disabled={!folded} onClick={() => { setQuery("timeout"); setSearched("timeout"); }}>timeout</button>, <button className="rc-word" disabled={!folded} onClick={() => { setQuery("runbook"); setSearched("runbook"); }}>runbook</button> or <button className="rc-word" disabled={!folded} onClick={() => { setQuery("ECONNRESET"); setSearched("ECONNRESET"); }}>ECONNRESET</button>.</p></div>
      <div><form onSubmit={search}><label htmlFor="rc-query">Keyword query</label><div className="rc-query"><input id="rc-query" value={query} onChange={e => setQuery(e.target.value)} placeholder="timeout" disabled={!folded} /><button type="submit" disabled={!folded || !query.trim()}><Search size={15} /> Search</button></div></form>
        <div className="rc-search-results" aria-live="polite">{!folded ? <p>Fold history to begin.</p> : searched === null ? <p>Search finds a location; it does not restore the original.</p> : hits.length ? hits.map(b => <button key={b.id} onClick={() => { choose(b.id); setMode("one"); }}><strong>{b.id} · {b.title}</strong><span>{b.summary}</span><small>{b.span} · select block →</small></button>) : <p>No summary match for “{searched}”. A miss does not prove the source lacks the detail: this example’s digest omits the exact error.</p>}</div>
      </div>
    </div>
    <section className="rc-recover-section"><p className="ch-kicker">02 / CHOOSE FIDELITY</p><h3>How much detail do you need back?</h3>
      <div className="rc-operations">{operations.map(op => <button key={op.mode} aria-pressed={mode === op.mode} onClick={() => { setMode(op.mode); setRestored(null); }} disabled={!folded}><small>{op.label}</small><strong>{op.title}</strong><span>{op.description}</span></button>)}</div>
      <div className="rc-recover-controls">{mode === "retrieve" ? <label>Original message<select value={message} onChange={e => { setMessage(e.target.value); setRestored(null); }} disabled={!folded}>{recoveryMessages.map(m => <option key={m.id} value={m.id}>{m.id} · {m.title}</option>)}</select></label> : <label>Selected block<select value={target} onChange={e => choose(e.target.value)} disabled={!folded}><option value={recoveryRoot.id}>b021 · Migration phase (T2)</option>{recoveryBlocks.map(b => <option key={b.id} value={b.id}>{b.id} · {b.title} (T1)</option>)}</select></label>}
        <button className="rc-action" disabled={!folded} onClick={() => { setRestored({ target: mode === "retrieve" ? message : target, mode }); setStep(4); }}>Recover source <ArrowRight size={15} /></button>
      </div>
      <p className="rc-feedback" role="status">{restored ? retained ? `Returned ${items.length} ${restored.mode === "one" && restored.target === recoveryRoot.id ? "child summaries" : "original messages"}. Read the evidence in Resident above; b021 remains active.` : "Recovery failed: source text is unavailable. Keep originals available to retry." : "A summary may answer the broad question already. Recover only when the next step needs more detail."}</p>
      {restored ? <a className="rc-evidence-link" href="#rc-evidence">View returned evidence ↑</a> : null}
    </section>
    <section className="rc-comparison"><div><p className="ch-kicker">SUMMARY ALONE</p><h3>An endpoint.</h3><p>“Migration completed.”</p><ArrowDown size={18} /><p>Exact command?</p><strong>Not recoverable from this summary.</strong><span>If originals are discarded, fidelity is lost.</span></div><div><p className="ch-kicker">SUMMARY + LINEAGE + RETAINED SOURCE</p><h3>An index.</h3><p>b021 → b017 → m00468</p><ArrowDown size={18} /><code>npm run test:auth -- --runInBand</code><strong>Read the retained original.</strong><span>Recovery reads storage; it does not invert the summary.</span></div></section>
    <div className="rc-formula"><MathTex tex={String.raw`x \xrightarrow{\text{lossy summary}} s \qquad s \not\Rightarrow x`} display /><MathTex tex={String.raw`\text{retained }x + \operatorname{lineage}(s) \xrightarrow{\text{source lookup}} x`} display /><p>Compression is lossy. Recoverability is a property of the storage and access architecture.</p></div>
    <section className="rc-lifecycle"><p className="ch-kicker">THE LOOP CLOSES</p><div>{lifecycle.map(([label], i) => <button key={label} aria-pressed={step === i} onClick={() => setStep(i)}><small>{String(i + 1).padStart(2, "0")}</small>{label}{i < lifecycle.length - 1 ? <ArrowRight size={14} aria-hidden="true" /> : <RotateCcw size={14} aria-hidden="true" />}</button>)}</div><p role="status">{lifecycle[step][1]}</p><span>Recover → resume work. This is a conceptual loop; tools are chosen as needed.</span></section>
  </div>;
}
