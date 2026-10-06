import test from 'node:test';
import assert from 'node:assert/strict';
import { nearbySolution, multiply } from '../components/column-space-math.ts';

const assertSolution = (matrix, point) => {
  assert.ok(point);
  const actual = multiply(matrix, point);
  assert.ok(Math.hypot(actual[0] - matrix[2], actual[1] - matrix[5]) < 1e-12);
};

test('nearby points project onto the solution line without locking distant points', () => {
  const matrix = [1, 1, 2, 2, 2, 4];
  const point = nearbySolution(matrix, [1, 1.12], .1);
  assertSolution(matrix, point);
  assert.ok(Math.abs(point[0] - .94) < 1e-12);
  assert.ok(Math.abs(point[1] - 1.06) < 1e-12);
  assert.equal(nearbySolution(matrix, [1, 1.8], .1), null);
});

test('a unique solution attracts nearby points only', () => {
  const matrix = [2, 1, 3, 1, 2, 3];
  assert.deepEqual(nearbySolution(matrix, [1.06, .98], .1), [1, 1]);
  assert.equal(nearbySolution(matrix, [1.2, 1.2], .1), null);
});

test('inconsistent systems do not snap to an individual row equation', () => {
  assert.equal(nearbySolution([1, 1, 2, 2, 2, 5], [1, 1.01], .1), null);
  assert.equal(nearbySolution([0, 0, 1, 0, 0, 0], [0, 0], 1), null);
  assert.deepEqual(nearbySolution([0, 0, 0, 0, 0, 0], [3.2, -4.1], 0), [3.2, -4.1]);
});

test('vertical, horizontal and fractional solutions retain full precision', () => {
  assert.deepEqual(nearbySolution([3, 0, 6, 0, 0, 0], [2.1, 1.23], .12), [2, 1.23]);
  assert.deepEqual(nearbySolution([0, 0, 0, 0, 2, 4], [1.23, 2.1], .12), [1.23, 2]);
  const matrix = [3, 7, 11, 6, 14, 22];
  assertSolution(matrix, nearbySolution(matrix, [.25, 10.25 / 7 + .01], .1));
});
