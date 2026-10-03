"use client";
import { useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  FileText,
  Layers,
  LockKeyhole,
  Search,
  Undo2,
} from "lucide-react";
import {
  auditDigest,
  chars,
  faithfulDigest,
  foldBlock,
  foldSources,
  planFold,
  recoverBlock,
  searchDigests,
  sourceSize,
  thinDigest,
  timeoutValues,
  workingSize,
  type DigestBlock,
} from "@/lib/context-simulator";
const fmt = (n: number) => n.toLocaleString("en-US");
export function FoldLab() {
  const [start, setStart] = useState(1),
    [end, setEnd] = useState(6),
    [summary, setSummary] = useState(faithfulDigest),
    [blocks, setBlocks] = useState<DigestBlock[]>([]);
  const [step, setStep] = useState(0),
    [inspected, setInspected] = useState("m00003"),
    [notice, setNotice] = useState(
      "Choose a consumed range. Protected messages stay outside its coverage.",
    );
  const [query, setQuery] = useState("routing"),
    [searched, setSearched] = useState(false),
    [target, setTarget] = useState(""),
    [precise, setPrecise] = useState(true),
    [ccr, setCcr] = useState(true);
  const [recovery, setRecovery] = useState<{
    mode: "copy" | "file";
    blockId: string;
    items: { id: string; text: string }[];
    read: boolean;
  } | null>(null);
  const [probe, setProbe] = useState(false);
  const plan = planFold(start, end, blocks),
    audit = auditDigest(summary, plan.ids),
    covered = new Set(blocks.flatMap((b) => b.messageIds));
  const base = sourceSize(foldSources.map((m) => m.id)),
    resident = workingSize(blocks);
  const recoveryText =
    recovery?.items.map((m) => `${m.id}\n${m.text}`).join("\n\n") ?? "";
  const payload =
    recovery && (recovery.mode === "copy" || recovery.read)
      ? chars(recoveryText)
      : recovery
        ? chars(`/source/${recovery.blockId}.txt`)
        : 0;
  const liveText = [
    ...foldSources.filter((m) => !covered.has(m.id)).map((m) => m.text),
    ...blocks.map((b) => b.summary),
    ...(recovery && (recovery.mode === "copy" || recovery.read)
      ? [recoveryText]
      : []),
  ].join("\n");
  const evidenceValues = timeoutValues(liveText);
  const hits = searchDigests(query, blocks),
    picked = blocks.find((b) => b.id === target) ?? blocks[0];
  function reset() {
    setBlocks([]);
    setRecovery(null);
    setProbe(false);
    setStep(0);
    setSearched(false);
    setTarget("");
    setQuery("routing");
    setPrecise(true);
    setCcr(true);
    setInspected("m00003");
    setStart(1);
    setEnd(6);
    setSummary(faithfulDigest);
    setNotice("History reset. Original refs are unchanged.");
  }
  function commit() {
    if (plan.error || !summary.trim()) {
      setNotice(plan.error || "Write a digest before committing.");
      return;
    }
    const next = foldBlock(blocks, plan.ids, summary);
    setBlocks(next);
    setTarget(next[next.length - 1].id);
    setStep(2);
    setRecovery(null);
    setProbe(false);
    setSearched(false);
    setNotice(
      `Created ${next[next.length - 1].id}. ${plan.ids.length} original messages remain stored; their digest now represents them in the working view.`,
    );
  }
  function restore(mode: "copy" | "file") {
    if (!picked) return;
    if (precise && !ccr) {
      setNotice(
        "A message subrange requires CCR. Enable it or recover the whole block.",
      );
      return;
    }
    let items = recoverBlock(picked, blocks, true);
    if (precise) items = items.filter((m) => m.id === "m00003");
    if (!items.length) {
      setNotice(
        `${picked.id} does not cover m00003. Choose its owning block or recover the whole block.`,
      );
      return;
    }
    setRecovery({ mode, blockId: picked.id, items, read: false });
    setProbe(false);
    setNotice(
      mode === "copy"
        ? "Source text returned as a tool result. The digest remains active."
        : "File pointer returned. The source text has not entered the working view yet.",
    );
  }
  return (
    <div className="fs-lab">
      <div className="fs-heading">
        <div>
          <p className="ch-kicker">FOLD WORKBENCH</p>
          <h2>
            A smaller view.
            <br />
            <em>An intact source.</em>
          </h2>
        </div>
        <p>
          Make a fold, then try to answer an exact question. Every change below
          follows the selected range and the digest you write.
        </p>
      </div>
      <div className="fs-steps" aria-label="Workbench steps">
        {["Select a range", "Write the digest", "Recover a detail"].map(
          (s, i) => (
            <button
              key={s}
              aria-pressed={step === i}
              onClick={() => setStep(i)}
            >
              <span>0{i + 1}</span>
              {s}
              {i < 2 ? <ArrowRight size={15} /> : null}
            </button>
          ),
        )}
        <button onClick={reset} aria-label="Reset Fold workbench">
          <Undo2 size={15} />
          Reset
        </button>
      </div>
      <div className="fs-metrics">
        <div>
          <span>WORKING VIEW</span>
          <strong>
            {fmt(resident + payload)}
            <small> chars</small>
          </strong>
          <p>
            {payload
              ? `${fmt(resident)} resident + ${fmt(payload)} recovery response`
              : "Text size computed from this scenario"}
          </p>
        </div>
        <div>
          <span>SOURCE RETAINED</span>
          <strong>
            {fmt(base)}
            <small> chars</small>
          </strong>
          <p>{foldSources.length} immutable source messages</p>
        </div>
        <div>
          <span>RESIDENT REDUCTION</span>
          <strong>
            {Math.round((1 - resident / base) * 100)}
            <small>%</small>
          </strong>
          <p>Digest size matters; recovery adds input</p>
        </div>
      </div>
      <div className="fs-workspace">
        <section className="fs-archive">
          <div className="fs-panel-title">
            <FileText size={16} />
            <span>SOURCE HISTORY</span>
            <small>always retained</small>
          </div>
          <div className="fs-source-list">
            {foldSources.map((m, i) => (
              <button
                key={m.id}
                onClick={() => setInspected(m.id)}
                aria-pressed={inspected === m.id}
                className={`${plan.ids.includes(m.id) && step < 2 ? "in-range" : ""} ${m.protected ? "is-protected" : ""} ${covered.has(m.id) ? "is-folded" : ""}`}
              >
                <code>{m.id}</code>
                <span>{m.label}</span>
                {m.protected ? (
                  <LockKeyhole size={12} aria-label="Protected" />
                ) : covered.has(m.id) ? (
                  <Layers size={12} aria-label="Folded" />
                ) : (
                  <small>{fmt(chars(m.text))}</small>
                )}
                <span className="fs-rail" aria-hidden="true" />
              </button>
            ))}
          </div>
          <details key={inspected} className="fs-source-detail">
            <summary>Inspect {inspected} · exact source</summary>
            <pre>{foldSources.find((m) => m.id === inspected)?.text}</pre>
          </details>
        </section>
        <div className="fs-transfer" aria-hidden="true">
          <ArrowRight />
          <span>
            {blocks.length ? "folded" : "select"}
            <br />
            view
          </span>
        </div>
        <section className="fs-view">
          <div className="fs-panel-title">
            <Layers size={16} />
            <span>MODEL WORKING VIEW</span>
            <small>this request</small>
          </div>
          <div className="fs-view-list">
            {foldSources.map((m) => {
              const owner = blocks.find((b) => b.messageIds.includes(m.id));
              if (owner) {
                if (owner.messageIds[0] !== m.id) return null;
                return (
                  <article className="fs-digest-card" key={owner.id}>
                    <div>
                      <span>
                        <Layers size={13} /> {owner.id} / T1
                      </span>
                      <small>{fmt(chars(owner.summary))} chars</small>
                    </div>
                    <p>{owner.summary}</p>
                    <footer>
                      {owner.messageIds[0]} →{" "}
                      {owner.messageIds[owner.messageIds.length - 1]}
                      <span>source links retained</span>
                    </footer>
                  </article>
                );
              }
              return (
                <article
                  key={m.id}
                  className={`fs-raw-card ${m.protected ? "protected" : ""} ${step < 2 && plan.ids.includes(m.id) ? "will-fold" : ""}`}
                >
                  <code>{m.id}</code>
                  <p>{m.text.split("\n")[0]}</p>
                  <small>
                    {m.protected ? "KEEP RAW" : `${fmt(chars(m.text))} chars`}
                  </small>
                </article>
              );
            })}
            {recovery ? (
              <article
                className="fs-return-card"
                key={`${recovery.mode}-${recovery.read}`}
              >
                <span>
                  <ArrowDownRight size={15} />{" "}
                  {recovery.mode === "copy" || recovery.read
                    ? "SOURCE READ / TOOL RESULT"
                    : "FILE POINTER / NOT YET READ"}
                </span>
                <p>
                  {recovery.mode === "copy" || recovery.read
                    ? `${recovery.items.length} source message(s) now available to the model.`
                    : `/source/${recovery.blockId}.txt — contents remain outside the request.`}
                </p>
              </article>
            ) : null}
          </div>
        </section>
      </div>
      <div className="fs-control-panel">
        {step === 0 ? (
          <>
            <div className="fs-section-title">
              <span>01 / BOUNDARIES</span>
              <h3>What has the task finished using?</h3>
            </div>
            <div className="ch-controls">
              <button
                onClick={() => {
                  setStart(1);
                  setEnd(6);
                }}
              >
                Consumed routing step
              </button>
              <button
                onClick={() => {
                  setStart(2);
                  setEnd(2);
                }}
              >
                Only a tool result
              </button>
              <button
                onClick={() => {
                  setStart(5);
                  setEnd(9);
                }}
              >
                Cross the protected zone
              </button>
              <button
                onClick={() => {
                  setStart(7);
                  setEnd(11);
                }}
              >
                Only recent work
              </button>
            </div>
            <div className="fs-range-inputs">
              <label>
                Start
                <select
                  value={start}
                  onChange={(e) => setStart(Number(e.target.value))}
                >
                  {foldSources.map((m, i) => (
                    <option key={m.id} value={i}>
                      {m.id} · {m.label}
                    </option>
                  ))}
                </select>
              </label>
              <span>→</span>
              <label>
                End
                <select
                  value={end}
                  onChange={(e) => setEnd(Number(e.target.value))}
                >
                  {foldSources.map((m, i) => (
                    <option key={m.id} value={i}>
                      {m.id} · {m.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="fs-validation">
              <strong>
                {plan.error
                  ? "No foldable range"
                  : `${plan.ids.length} messages · ${fmt(sourceSize(plan.ids))} source chars`}
              </strong>
              {plan.notes.map((n) => (
                <p key={n}>{n}</p>
              ))}
              {plan.error ? (
                <p>{plan.error}</p>
              ) : (
                <p>Effective coverage: {plan.ids.join(", ")}</p>
              )}
            </div>
            <button className="ch-primary" onClick={() => setStep(1)}>
              Compose its digest <ArrowRight size={16} />
            </button>
          </>
        ) : null}
        {step === 1 ? (
          <>
            <div className="fs-section-title">
              <span>02 / SEMANTIC JUDGMENT</span>
              <h3>Small is useful only if the meaning survives.</h3>
            </div>
            <div className="ch-controls">
              <button onClick={() => setSummary(faithfulDigest)}>
                Preserve decisions + exact values
              </button>
              <button onClick={() => setSummary(thinDigest)}>
                Try an over-compressed digest
              </button>
              <button
                onClick={() =>
                  setSummary(faithfulDigest.replace("2500", "2600"))
                }
              >
                Try a wrong exact value
              </button>
            </div>
            <label className="fs-editor-label" htmlFor="fold-summary">
              Your digest · editable
            </label>
            <textarea
              id="fold-summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={5}
            />
            <div className="fs-audit">
              {audit.map((c) => (
                <span className={c.kept ? "kept" : "omitted"} key={c.term}>
                  {c.kept ? (
                    <Check size={13} />
                  ) : (
                    <span aria-hidden="true">−</span>
                  )}
                  {c.label}
                  <small>{c.kept ? "represented" : "not found"}</small>
                </span>
              ))}
            </div>
            <p className="ch-muted">
              This audit checks a few literal clues, not semantic correctness.
              The real kernel enforces structure; it cannot certify a useful
              digest.
            </p>
            <div className="ch-controls">
              <button className="ch-primary" onClick={commit}>
                Commit fold <ArrowRight size={16} />
              </button>
              <span>
                {fmt(chars(summary))} digest chars / {fmt(sourceSize(plan.ids))}{" "}
                source chars
              </span>
            </div>
          </>
        ) : null}
        {step === 2 ? (
          <>
            <div className="fs-section-title">
              <span>03 / EXACT RECOVERY</span>
              <h3>What was the timeout in src/router.ts:42?</h3>
            </div>
            <div className="ch-controls">
              <button className="ch-primary" onClick={() => setProbe(true)}>
                Check the current working view
              </button>
              <button
                onClick={() => {
                  setStep(0);
                  setRecovery(null);
                }}
              >
                Make another local fold
              </button>
            </div>
            {probe ? (
              <div
                className={`fs-probe ${evidenceValues.length === 1 && evidenceValues[0] === "2500" ? "resolved" : ""}`}
                role="status"
              >
                <strong>
                  {evidenceValues.length > 1
                    ? `Conflicting timeout values: ${evidenceValues.join(" / ")} ms`
                    : evidenceValues.length === 1
                      ? `${evidenceValues[0]} ms · asserted in the working view`
                      : "Not established by the current view"}
                </strong>
                <p>
                  {evidenceValues.length > 1
                    ? "The digest and returned source disagree. Recovery exposes the discrepancy; it does not silently repair the summary."
                    : evidenceValues.length === 1
                      ? "This literal value appears in raw source, the digest, or returned source text. A digest can also contain a mistaken value; inspect the original to check fidelity."
                      : "A short digest can omit an exact value. Read the retained original; do not infer the value from “routing fixed”."}
                </p>
              </div>
            ) : null}
            <div className="fs-recovery-grid">
              <div>
                <label className="fs-editor-label" htmlFor="fold-query">
                  Locate a digest
                </label>
                <div className="fs-search">
                  <input
                    id="fold-query"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSearched(false);
                    }}
                  />
                  <button
                    onClick={() => setSearched(true)}
                    aria-label="Search digests"
                  >
                    <Search size={17} />
                  </button>
                </div>
                <div className="ch-controls">
                  <button
                    onClick={() => {
                      setQuery("routing");
                      setSearched(true);
                    }}
                  >
                    routing
                  </button>
                  <button
                    onClick={() => {
                      setQuery("timeoutMs");
                      setSearched(true);
                    }}
                  >
                    timeoutMs
                  </button>
                </div>
                {searched ? (
                  <p role="status">
                    {hits.length
                      ? `Found ${hits.map((b) => b.id).join(", ")}.`
                      : "No digest match. An omitted term can still exist in the original."}
                  </p>
                ) : null}
                <label className="fs-editor-label">
                  Known block
                  <select
                    value={picked?.id ?? ""}
                    onChange={(e) => setTarget(e.target.value)}
                  >
                    {blocks.length ? (
                      blocks.map((b) => <option key={b.id}>{b.id}</option>)
                    ) : (
                      <option value="">Create a fold first</option>
                    )}
                  </select>
                </label>
              </div>
              <div>
                <p className="fs-editor-label">Source access</p>
                <label className="fs-check">
                  <input
                    type="checkbox"
                    checked={precise}
                    onChange={(e) => setPrecise(e.target.checked)}
                  />
                  Only m00003, the needed file result
                </label>
                <label className="fs-check">
                  <input
                    type="checkbox"
                    checked={ccr}
                    onChange={(e) => setCcr(e.target.checked)}
                  />
                  CCR retained-content store enabled
                </label>
                <div className="ch-controls">
                  <button disabled={!picked} onClick={() => restore("copy")}>
                    Return source copy
                  </button>
                  <button disabled={!picked} onClick={() => restore("file")}>
                    Return file pointer
                  </button>
                </div>
                {recovery?.mode === "file" && !recovery.read ? (
                  <button
                    className="ch-primary"
                    onClick={() => {
                      setRecovery((r) => (r ? { ...r, read: true } : null));
                      setProbe(false);
                      setNotice(
                        "File read returned the selected source into the working view. The digest stays active.",
                      );
                    }}
                  >
                    Read the source file <ArrowRight size={15} />
                  </button>
                ) : null}
              </div>
            </div>
            {recovery ? (
              <details className="fs-source-detail" open>
                <summary>
                  {recovery.mode === "file" && !recovery.read
                    ? "Source file preview · browser inspector only"
                    : "Returned source evidence"}{" "}
                  · {recovery.items.map((m) => m.id).join(", ")}
                </summary>
                <pre>{recoveryText}</pre>
              </details>
            ) : null}
          </>
        ) : null}
      </div>
      <p className="fs-status" role="status">
        {notice}
      </p>
      <details className="fs-contract">
        <summary>What this simulation models</summary>
        <p>
          Pair expansion, protected-ref exclusion, block coverage, digest
          replacement and source reads. The source fixture is synthetic; sizes
          count its actual characters, not model tokens. This visual view
          abstracts message rendering; production anchors and role conversion
          depend on the integration. The real kernel also handles reasoning
          integrity, minimum range sizes, media and overlapping batches. Search
          here uses literal digest matching; the proxy and kernel support richer
          lexical ranking. First intent and the five recent messages are fixed
          protections in this scenario.
        </p>
        <pre>
          {JSON.stringify(
            {
              requested: {
                startId: foldSources[start].id,
                endId: foldSources[end].id,
              },
              effectiveMessageIds: plan.ids,
              blocks: blocks.map((b) => ({
                blockId: b.id,
                tier: b.tier,
                active: b.active,
                directMessageIds: b.messageIds,
                directBlockIds: b.childIds,
              })),
            },
            null,
            2,
          )}
        </pre>
      </details>
    </div>
  );
}
