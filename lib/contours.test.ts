import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NUMBERS_HILLS, VISIT_HILLS, contourRings } from './contours.ts';

/** The farthest point of a ring path from the hill's centre. */
function maxRadius(d: string, cx: number, cy: number) {
  const nums = d.match(/-?\d+(\.\d+)?/g)!.map(Number);
  let max = 0;
  for (let i = 0; i < nums.length; i += 2) max = Math.max(max, Math.hypot(nums[i] - cx, nums[i + 1] - cy));
  return max;
}

test('one closed ring per contour', () => {
  const rings = contourRings([[230, 820, 10], [1380, 180, 12]]);
  assert.equal(rings.length, 22);
  for (const d of rings) assert.match(d, /^M[\d.\- ]+(L[\d.\- ]+)+Z$/);
});

test('rings grow outward', () => {
  const [a, b] = contourRings([[800, 500, 2]]);
  assert.ok(maxRadius(b, 800, 500) > maxRadius(a, 800, 500));
});

test('the same hills always draw the same rings (server and client agree)', () => {
  assert.deepEqual(contourRings(NUMBERS_HILLS), contourRings(NUMBERS_HILLS));
  assert.equal(contourRings(NUMBERS_HILLS).length, 29);
  assert.equal(contourRings(VISIT_HILLS).length, 21);
});
