"use client";
import { useState } from "react";
import { ArrowRight, GitBranch, Layers, Undo2 } from "lucide-react";
import {
  chars,
  promoteBlocks,
  recoverBlock,
  type DigestBlock,
  type SourceMessage,
} from "@/lib/context-simulator";
const sourcePairs = [
  [
    "Investigated src/router.ts:42; timeoutMs = 2500.",
    "Literal routes must precede dynamic routes to protect /notes/new.",
  ],
  [
    "Ran route-matching suite: 48 / 48 passed in 187ms.",
    "Verbose PASS lines consumed; preserve the successful outcome.",
  ],
  [
    "Designed ChapterNav with existing notebook URL slugs.",
    'Current chapter uses aria-current="page"; keyboard focus remains visible.',
  ],
  [
    "Checked small-screen navigation with horizontal overflow.",
    "Do not rename URLs; layout and focus order remain stable.",
  ],
];
const sources: SourceMessage[] = sourcePairs.flatMap((pair, i) =>
  pair.map((text, j) => ({
    id: `m${String(i * 2 + j + 1).padStart(5, "0")}`,
    label: "Original source",
    text,
  })),
);
const seed: DigestBlock[] = sourcePairs.map((_, i) => ({
  id: `b${i + 1}`,
  tier: 1,
  summary: [
    "Routing: literal before dynamic; src/router.ts:42 timeoutMs = 2500.",
    "Routing tests passed: 48/48 (187ms). Verbose logs retained.",
    "ChapterNav: preserve slugs; current-page and keyboard-focus states.",
    "Small-screen navigation checked; preserve URL and focus order.",
  ][i],
  messageIds: sources.slice(i * 2, i * 2 + 2).map((m) => m.id),
  childIds: [],
  active: true,
}));
export function HierarchyLab() {
  const [blocks, setBlocks] = useState(seed),
    [chosen, setChosen] = useState<string[]>([]),
    [focus, setFocus] = useState("b1"),
    [full, setFull] = useState(false);
  const [status, setStatus] = useState(
    "Select two or more active blocks in one tier. Promotion changes visibility, not the source graph.",
  );
  const selected = blocks.find((b) => b.id === focus) ?? blocks[0];
  const raw = recoverBlock(selected, blocks, full, sources);
  const active = blocks.filter((b) => b.active),
    mass = active.reduce((n, b) => n + chars(b.summary), 0),
    selectedNodes = blocks.filter((b) => chosen.includes(b.id));
  const valid =
    selectedNodes.length >= 2 &&
    new Set(selectedNodes.map((b) => b.tier)).size === 1 &&
    selectedNodes[0].tier < 3;
  const lineage = new Set<string>();
  function visit(id: string) {
    if (lineage.has(id)) return;
    lineage.add(id);
    blocks.find((b) => b.id === id)?.childIds.forEach(visit);
  }
  visit(selected.id);
  selected.messageIds.forEach((id) => lineage.add(id));
  function position(b: DigestBlock) {
    const ids = b.messageIds.map((id) => Number(id.slice(1)));
    return {
      x: 270 + (b.tier - 1) * 230,
      y: 55 + (((Math.min(...ids) + Math.max(...ids)) / 2 - 1.5) / 2) * 85,
    };
  }
  function promote() {
    if (!valid) return;
    const coverage = new Set(selectedNodes.flatMap((b) => b.messageIds));
    const details = [
      ["m00001", "Routing: literal before dynamic; timeout 2500."],
      ["m00003", "Tests: 48/48, 187ms."],
      ["m00005", "Navigation: keep slugs, current-page state and focus."],
      ["m00007", "Small-screen overflow verified."],
    ];
    const digest =
      selectedNodes[0].tier === 1
        ? details
            .filter(([id]) => coverage.has(id))
            .map(([, text]) => text)
            .join(" ")
        : "Routes + navigation verified; keep URLs, route priority and focus. Sources linked.";
    const next = promoteBlocks(blocks, chosen, digest);
    setBlocks(next);
    setFocus(next[next.length - 1].id);
    setChosen([]);
    setFull(false);
    setStatus(
      `Created ${next[next.length - 1].id} / T${next[next.length - 1].tier}. Children ${selectedNodes.map((b) => b.id).join(", ")} became inactive; original coverage remains reachable.`,
    );
  }
  return (
    <div className="hs-lab">
      <div className="fs-heading">
        <div>
          <p className="ch-kicker">LINEAGE EXPLORER</p>
          <h2>
            Fold the summaries.
            <br />
            <em>Keep their ancestry.</em>
          </h2>
        </div>
        <p>
          Build two tier-2 parents, then a tier-3 parent. Inspect any node to
          see what one-level and full recovery actually return.
        </p>
      </div>
      <div className="hs-metrics">
        <span>
          <strong>{active.length}</strong> active blocks
        </span>
        <span>
          <strong>{mass}</strong> resident digest chars
        </span>
        <span>
          <strong>{sources.length}</strong> originals retained
        </span>
      </div>
      <div className="hs-graph-scroll">
        <div
          className="hs-graph"
          role="group"
          aria-label="Interactive source lineage graph"
        >
          <div className="hs-column-labels">
            <span>ORIGINAL SOURCES</span>
            <span>TIER 1</span>
            <span>TIER 2</span>
            <span>TIER 3</span>
          </div>
          <svg viewBox="0 0 960 420" className="hs-edges" aria-hidden="true">
            {blocks.flatMap((b) => {
              const p = position(b);
              const children = b.childIds.length
                ? b.childIds.map((id) => {
                    const c = blocks.find((n) => n.id === id)!;
                    return {
                      id,
                      x: position(c).x + 150,
                      y: position(c).y + 31,
                    };
                  })
                : [{ id: b.messageIds[0], x: 190, y: p.y + 31 }];
              return children.map((c) => (
                <path
                  key={`${b.id}-${c.id}`}
                  className={lineage.has(b.id) ? "traced" : ""}
                  d={`M${c.x} ${c.y} C${c.x + 38} ${c.y},${p.x - 38} ${p.y + 31},${p.x} ${p.y + 31}`}
                />
              ));
            })}
          </svg>
          {sourcePairs.map((_, i) => (
            <div
              key={i}
              className={`hs-source-node ${selected.messageIds.includes(sources[i * 2].id) ? "traced" : ""}`}
              style={{ left: 25, top: 55 + i * 85 }}
            >
              <code>
                {sources[i * 2].id}–{sources[i * 2 + 1].id}
              </code>
              <span>
                {
                  [
                    "Routing investigation",
                    "Test evidence",
                    "Navigation design",
                    "Responsive checks",
                  ][i]
                }
              </span>
            </div>
          ))}
          {blocks.map((b) => {
            const p = position(b);
            return (
              <button
                style={{ left: p.x, top: p.y }}
                key={b.id}
                onClick={() => {
                  setFocus(b.id);
                  setFull(false);
                }}
                aria-pressed={focus === b.id}
                className={`hs-node ${b.active ? "active" : "archived"} ${focus === b.id ? "focused" : ""} ${lineage.has(b.id) ? "traced" : ""}`}
              >
                <span>
                  <Layers size={12} />
                  {b.id} / T{b.tier}
                  <small>{b.active ? "in view" : "lineage"}</small>
                </span>
                <strong>{b.messageIds.length} source messages</strong>
              </button>
            );
          })}
          <div className="hs-graph-key">
            <i />
            in working view <i className="inactive" />
            retained lineage <i className="trace" />
            selected ancestry
          </div>
        </div>
      </div>
      <div className="fs-control-panel">
        <div className="hs-promotion">
          <div>
            <p className="fs-editor-label">Select active blocks to distill</p>
            <div className="ch-controls">
              {active
                .filter((b) => b.tier < 3)
                .map((b) => (
                  <button
                    key={b.id}
                    aria-pressed={chosen.includes(b.id)}
                    className={chosen.includes(b.id) ? "selected" : ""}
                    onClick={() =>
                      setChosen((c) =>
                        c.includes(b.id)
                          ? c.filter((id) => id !== b.id)
                          : [...c, b.id],
                      )
                    }
                  >
                    {b.id} / T{b.tier}
                  </button>
                ))}
            </div>
          </div>
          <button className="ch-primary" disabled={!valid} onClick={promote}>
            Promote selected <ArrowRight size={15} />
          </button>
          <button
            className="hs-reset"
            onClick={() => {
              setBlocks(seed);
              setChosen([]);
              setFocus("b1");
              setFull(false);
              setStatus("Graph reset to four independent tier-1 blocks.");
            }}
          >
            <Undo2 size={15} />
            Reset
          </button>
        </div>
        <p className="ch-muted">
          Choose at least two active blocks of the same tier. Tier 3 is the
          highest tier in this model. Digests are preset teaching text; real
          summaries are model-written, with configurable promotion gates.
        </p>
      </div>
      <div className="hs-inspector">
        <section>
          <p className="ch-kicker">
            <GitBranch size={13} /> INSPECTING {selected.id} / T{selected.tier}
          </p>
          <h3>
            {selected.active ? "Visible digest" : "Retained child digest"}
          </h3>
          <p>{selected.summary}</p>
          <dl>
            <div>
              <dt>Direct children</dt>
              <dd>{selected.childIds.join(", ") || "Raw message sources"}</dd>
            </div>
            <div>
              <dt>Original coverage</dt>
              <dd>{selected.messageIds.join(", ")}</dd>
            </div>
          </dl>
        </section>
        <section>
          <div className="ch-controls">
            <button
              aria-pressed={!full}
              className={!full ? "selected" : ""}
              onClick={() => setFull(false)}
            >
              One level
            </button>
            <button
              aria-pressed={full}
              className={full ? "selected" : ""}
              onClick={() => setFull(true)}
            >
              Full originals
            </button>
          </div>
          <p className="ch-muted">
            {full
              ? "Follow lineage to retained original text."
              : "Return direct raw sources and immediate child digests."}
          </p>
          <div className="hs-recovered">
            {raw.map((item) => (
              <article key={item.id}>
                <code>{item.id}</code>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
      <p className="fs-status" role="status">
        {status}
      </p>
    </div>
  );
}
