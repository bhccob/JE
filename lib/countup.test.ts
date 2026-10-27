import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countUpText, hasCount } from './countup.ts';

test('figures of ten or more count up from zero', () => {
  assert.equal(countUpText('8,000 W', 0), '0 W');
  assert.equal(countUpText('8,000 W', 0.5), '4,000 W');
  assert.equal(countUpText('8,000 W', 1), '8,000 W');
  assert.equal(countUpText('2,560 Wh', 0.5), '1,280 Wh');
  assert.equal(countUpText('10 ms', 0), '0 ms');
});

test('single digits stay put', () => {
  assert.equal(countUpText('2 × 5,500 W', 0.5), '2 × 2,750 W');
  assert.equal(countUpText('4', 0.3), '4');
});

test('ranges and percentages keep their shape', () => {
  assert.equal(countUpText('9k–36k', 0.5), '9k–18k');
  assert.equal(countUpText('Up to 100%', 0.25), 'Up to 25%');
  assert.equal(countUpText('No battery', 0.5), 'No battery');
});

test('progress is clamped, and nonsense shows the final text', () => {
  assert.equal(countUpText('8,000 W', 2), '8,000 W');
  assert.equal(countUpText('8,000 W', -1), '0 W');
  assert.equal(countUpText('8,000 W', Number.NaN), '8,000 W');
});

test('only text with a figure of ten or more counts', () => {
  assert.equal(hasCount('8,000 W'), true);
  assert.equal(hasCount('4'), false);
  assert.equal(hasCount('No battery'), false);
});
