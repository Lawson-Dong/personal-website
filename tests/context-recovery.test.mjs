import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recoveryMessages, recoveryBlocks, searchRecovery, recoverItems } from '../lib/context-recovery.ts';
import { lessons, interactiveChapters } from '../lib/context-lessons.ts';
test('Recovery is chapter 11 and registered once in navigation and interactive studies', () => {
  assert.equal(lessons.at(-1).slug, 'recovery');
  assert.equal(lessons.at(-1).title, '11. Recovery');
  assert.equal(lessons.length, 12);
  assert.equal(interactiveChapters.filter(id => id === 'recovery').length, 1);
});
test('a summary-search miss can coexist with a recoverable exact error', () => {
  assert.deepEqual(searchRecovery('ECONNRESET'), []);
  assert.match(recoverItems('m00437', 'retrieve')[0].text, /ECONNRESET/);
  assert.equal(searchRecovery('timeout')[0].id, 'b017');
  assert.equal(searchRecovery('runbook')[0].id, 'b018');
  assert.deepEqual(searchRecovery('  '), []);
});
test('one-level and full recovery differ at T2 while preserving all source coverage', () => {
  assert.deepEqual(recoverItems('b021', 'one').map(i => i.id), ['b017','b018']);
  assert.deepEqual(recoverItems('b021', 'full').map(i => i.id), recoveryMessages.map(i => i.id));
  assert.deepEqual(recoveryBlocks.flatMap(b => b.sourceIds), recoveryMessages.map(i => i.id));
  assert.equal(recoverItems('b017', 'one').length, 4);
  assert.deepEqual(recoverItems('b017', 'one'), recoverItems('b017', 'full'));
  assert.deepEqual(recoverItems('unknown', 'full'), []);
});
test('retrieval returns exact retained text without changing the source graph', () => {
  const snapshot = JSON.stringify({ recoveryBlocks, recoveryMessages });
  assert.equal(recoverItems('m00468','retrieve')[0].text, 'npm run test:auth -- --runInBand\nResult: 18 passed, 0 failed. Retry policy: 2 retries.');
  recoverItems('b021','full');
  assert.equal(JSON.stringify({ recoveryBlocks, recoveryMessages }), snapshot);
});
