import test from "node:test";
import assert from "node:assert/strict";
import {
  foldSources,
  planFold,
  foldBlock,
  faithfulDigest,
  thinDigest,
  workingSize,
  sourceSize,
  auditDigest,
  searchDigests,
  promoteBlocks,
  recoverBlock,
} from "../lib/context-simulator.ts";

test("a result-only range expands to its call; protected content is excluded", () => {
  assert.deepEqual(planFold(2, 2).ids, ["m00002", "m00003"]);
  assert.match(planFold(2, 2).notes[0], /Pair boundary extended/);
  const mixed = planFold(5, 9);
  assert.deepEqual(mixed.ids, ["m00005", "m00006", "m00007"]);
  assert.match(mixed.notes.join(" "), /Protected refs/);
  assert.equal(planFold(7, 11).ids.length, 0);
  assert.match(planFold(7, 11).error, /protected/);
  assert.match(planFold(6, 1).error, /Start/);
});
test("protection carving cannot strand one half of a tool pair", () => {
  const fixture = foldSources.map((m) =>
    m.id === "m00003" ? { ...m, protected: "protected result" } : m,
  );
  assert.deepEqual(planFold(1, 2, [], fixture).ids, []);
});
test("folds change resident size without rewriting or deleting originals", () => {
  const original = JSON.stringify(foldSources),
    plan = planFold(1, 6);
  const blocks = foldBlock([], plan.ids, faithfulDigest);
  const old = blocks[0];
  assert.ok(workingSize(blocks) < sourceSize(foldSources.map((m) => m.id)));
  assert.deepEqual(
    recoverBlock(old, blocks, true),
    foldSources.slice(1, 7).map((m) => ({ id: m.id, text: m.text })),
  );
  assert.equal(old.active, true);
  assert.equal(JSON.stringify(foldSources), original);
  assert.equal(planFold(1, 6, blocks).ids.length, 0);
  assert.equal(foldBlock(blocks, [], thinDigest), blocks);
});
test("digest omissions affect both exact evidence and literal search", () => {
  const ids = planFold(1, 6).ids;
  assert.ok(auditDigest(faithfulDigest, ids).every((c) => c.kept));
  assert.ok(auditDigest(thinDigest, ids).every((c) => !c.kept));
  const blocks = foldBlock([], ids, thinDigest);
  assert.equal(searchDigests("timeoutMs", blocks).length, 0);
  assert.equal(searchDigests("routing", blocks).length, 1);
  assert.match(
    recoverBlock(blocks[0], blocks, true)
      .map((m) => m.text)
      .join(" "),
    /timeoutMs = 2500/,
  );
});
test("higher tiers deactivate children but preserve transitive coverage and full recovery", () => {
  let blocks = foldBlock([], ["m00002", "m00003"], "Read source.");
  blocks = foldBlock(blocks, ["m00005", "m00006"], "Tests passed.");
  const before = JSON.stringify(blocks);
  const next = promoteBlocks(blocks, ["b1", "b2"], "Routing verified.");
  assert.equal(JSON.stringify(blocks), before);
  assert.deepEqual(
    next.filter((b) => b.active).map((b) => b.id),
    ["b3"],
  );
  assert.equal(next[2].tier, 2);
  assert.deepEqual(next[2].childIds, ["b1", "b2"]);
  assert.deepEqual(
    recoverBlock(next[2], next, false).map((m) => m.id),
    ["b1", "b2"],
  );
  assert.deepEqual(
    recoverBlock(next[2], next, true).map((m) => m.id),
    ["m00002", "m00003", "m00005", "m00006"],
  );
  assert.equal(promoteBlocks(next, ["b1", "b3"], "invalid"), next);
});
