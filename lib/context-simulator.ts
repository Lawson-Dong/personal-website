export type SourceMessage = {
  id: string;
  label: string;
  text: string;
  pair?: string;
  protected?: string;
};
export type DigestBlock = {
  id: string;
  tier: number;
  summary: string;
  messageIds: string[];
  childIds: string[];
  active: boolean;
};
const logs = Array.from(
  { length: 48 },
  (_, i) =>
    `PASS route-case-${String(i + 1).padStart(2, "0")} · matched expected response`,
).join("\n");
export const foldSources: SourceMessage[] = [
  {
    id: "m00001",
    label: "Task intent",
    text: "Preserve existing notebook URLs. Fix route matching without breaking chapter navigation.",
    protected: "first user / intent",
  },
  {
    id: "m00002",
    label: "read_file call",
    text: 'read_file("src/router.ts")',
    pair: "read",
  },
  {
    id: "m00003",
    label: "Source code result",
    pair: "read",
    text:
      "src/router.ts:42\nconst timeoutMs = 2500;\n// Dynamic routes must be checked AFTER literal routes.\nexport function match(path: string) {\n  const literal = routes.find(r => r.path === path);\n  if (literal) return literal;\n  return dynamicRoutes.find(r => r.pattern.test(path));\n}\n" +
      Array.from(
        { length: 30 },
        (_, i) =>
          `// fixture ${i + 1}: /notes/${i + 1} must preserve its literal route`,
      ).join("\n"),
  },
  {
    id: "m00004",
    label: "Decision + rationale",
    text: "Keep literal routes before dynamic routes: otherwise /notes/new is captured by /notes/:id. Keep timeoutMs = 2500 in src/router.ts:42.",
  },
  {
    id: "m00005",
    label: "run_tests call",
    pair: "test",
    text: 'run_tests("route-matching")',
  },
  {
    id: "m00006",
    label: "Consumed test log",
    pair: "test",
    text: logs + "\n48 / 48 passed. Exact elapsed time: 187ms.",
  },
  {
    id: "m00007",
    label: "Conclusion",
    text: "Routing fix verified. Preserve route priority and existing URLs; repeated PASS lines no longer help the current step.",
  },
  {
    id: "m00008",
    label: "Latest user request",
    text: "Now build the chapter navigation. Do not rename existing notebook URLs.",
    protected: "last user + recent zone",
  },
  {
    id: "m00009",
    label: "Current plan",
    text: "Use links with the existing slugs and keep keyboard focus visible.",
    protected: "recent zone",
  },
  {
    id: "m00010",
    label: "Current source",
    text: "ChapterNav receives chapter titles and existing URL slugs.",
    protected: "recent zone",
  },
  {
    id: "m00011",
    label: "Active decision",
    text: 'Mark the current chapter with aria-current="page".',
    protected: "recent zone",
  },
  {
    id: "m00012",
    label: "Working step",
    text: "Still designing responsive navigation and its focus states.",
    protected: "recent zone",
  },
];
export const faithfulDigest =
  "TASK AS OF THIS BLOCK: Routing fixed; keep literal routes before dynamic routes to stop /notes/new matching /notes/:id. Preserve notebook URLs. src/router.ts:42 timeoutMs = 2500. Route suite: 48/48 passed (187ms). Sources m00002–m00007; file fixtures and verbose PASS logs retained for recovery.";
export const thinDigest =
  "Routing fixed. Tests passed. Continue with chapter navigation.";
export function chars(text: string) {
  return Array.from(text).length;
}
export function sourceSize(ids: string[], sources = foldSources) {
  return sources
    .filter((m) => ids.includes(m.id))
    .reduce((n, m) => n + chars(m.text), 0);
}
export function planFold(
  start: number,
  end: number,
  blocks: DigestBlock[] = [],
  sources = foldSources,
) {
  const notes: string[] = [];
  if (start > end || start < 0 || end >= sources.length)
    return {
      ids: [] as string[],
      notes,
      error: "Start must precede end in the available history.",
    };
  let lo = start,
    hi = end;
  const pairs = new Set(
    sources
      .slice(lo, hi + 1)
      .map((m) => m.pair)
      .filter(Boolean),
  );
  sources.forEach((m, i) => {
    if (m.pair && pairs.has(m.pair)) {
      lo = Math.min(lo, i);
      hi = Math.max(hi, i);
    }
  });
  if (lo !== start || hi !== end)
    notes.push(
      `Pair boundary extended to ${sources[lo].id}–${sources[hi].id}: calls and results travel together.`,
    );
  const range = sources.slice(lo, hi + 1);
  const excluded = range.filter((m) => m.protected);
  if (excluded.length)
    notes.push(
      `Protected refs stay raw: ${excluded.map((m) => m.id).join(", ")}.`,
    );
  let picked = range.filter((m) => !m.protected);
  for (const pair of pairs) {
    const members = sources.filter((m) => m.pair === pair);
    if (members.some((m) => m.protected))
      picked = picked.filter((m) => m.pair !== pair);
  }
  const covered = new Set(
    blocks.filter((b) => b.active).flatMap((b) => b.messageIds),
  );
  picked = picked.filter((m) => !covered.has(m.id));
  return {
    ids: picked.map((m) => m.id),
    notes,
    error: picked.length
      ? ""
      : "No fresh compressible content: this range is protected or already folded.",
  };
}
export function auditDigest(summary: string, ids: string[]) {
  const checks = [
    {
      source: "m00004",
      term: "literal",
      label: "route ordering and its rationale",
    },
    { source: "m00003", term: "2500", label: "exact timeout: 2500" },
    { source: "m00006", term: "187", label: "exact elapsed time: 187ms" },
  ];
  return checks
    .filter((c) => ids.includes(c.source))
    .map((c) => ({ ...c, kept: summary.toLowerCase().includes(c.term) }));
}
export function foldBlock(
  blocks: DigestBlock[],
  ids: string[],
  summary: string,
): DigestBlock[] {
  if (!ids.length || !summary.trim()) return blocks;
  return [
    ...blocks,
    {
      id: `b${blocks.length + 1}`,
      tier: 1,
      summary: summary.trim(),
      messageIds: [...ids],
      childIds: [],
      active: true,
    },
  ];
}
export function workingSize(blocks: DigestBlock[], sources = foldSources) {
  const covered = new Set(
    blocks.filter((b) => b.active).flatMap((b) => b.messageIds),
  );
  return (
    sources
      .filter((m) => !covered.has(m.id))
      .reduce((n, m) => n + chars(m.text), 0) +
    blocks.filter((b) => b.active).reduce((n, b) => n + chars(b.summary), 0)
  );
}
export function recoverBlock(
  block: DigestBlock,
  blocks: DigestBlock[],
  full: boolean,
  sources = foldSources,
): { id: string; text: string }[] {
  if (full)
    return sources
      .filter((m) => block.messageIds.includes(m.id))
      .map((m) => ({ id: m.id, text: m.text }));
  return [
    ...sources
      .filter(
        (m) =>
          block.messageIds.includes(m.id) &&
          !block.childIds.some((id) =>
            blocks.find((b) => b.id === id)?.messageIds.includes(m.id),
          ),
      )
      .map((m) => ({ id: m.id, text: m.text })),
    ...block.childIds
      .map((id) => blocks.find((b) => b.id === id))
      .filter((b): b is DigestBlock => !!b)
      .map((b) => ({ id: b.id, text: b.summary })),
  ];
}
export function promoteBlocks(
  blocks: DigestBlock[],
  ids: string[],
  summary: string,
) {
  const children = blocks.filter((b) => ids.includes(b.id) && b.active);
  if (
    children.length < 2 ||
    new Set(children.map((b) => b.tier)).size !== 1 ||
    children[0].tier >= 3
  )
    return blocks;
  const parent: DigestBlock = {
    id: `b${blocks.length + 1}`,
    tier: children[0].tier + 1,
    summary,
    messageIds: [...new Set(children.flatMap((b) => b.messageIds))],
    childIds: children.map((b) => b.id),
    active: true,
  };
  return [
    ...blocks.map((b) => (ids.includes(b.id) ? { ...b, active: false } : b)),
    parent,
  ];
}
export function searchDigests(query: string, blocks: DigestBlock[]) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return terms.length
    ? blocks.filter((b) =>
        terms.every((t) => b.summary.toLowerCase().includes(t)),
      )
    : [];
}
