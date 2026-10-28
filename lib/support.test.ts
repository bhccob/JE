import { test } from 'node:test';
import assert from 'node:assert/strict';
import { QUESTIONS, RETURNS, SERVICE, WARRANTY } from './support.ts';

const all = JSON.stringify({ QUESTIONS, WARRANTY, RETURNS, SERVICE });

test('support never promises installation or work on site', () => {
  // Installing comes up only to say who does it, and that the store does not.
  assert.doesNotMatch(all, /we install|installation (service|labour|warranty)|our (technician|installer)s?|on-site|certified/i);
});

test('the policies never mention labour or technicians', () => {
  // Both read as installation or work on site; Questions may still say who installs (an electrician, a technician).
  assert.doesNotMatch(JSON.stringify({ WARRANTY, RETURNS, SERVICE }), /labour|technician/i);
});

test('support shows no prices, financing or efficiency figures', () => {
  assert.doesNotMatch(all, /\$|AWG|Afl\.?\s?\d|financ|efficien/i);
});

test('the warranty periods are the store policy, from the date of purchase', () => {
  assert.deepEqual(
    WARRANTY.periods.map((p) => [p.what, p.period]),
    [
      ['Solar panels', '10 years'],
      ['Inverters and batteries', '5 years'],
      ['LED fixtures and drivers', '3 years'],
      ['Electrical hardware', '1 year'],
      ['Other hardware', '6 months'],
    ],
  );
  assert.match(WARRANTY.from, /date of purchase/);
});

test('returns take 14 days with the receipt, and repairs carry 90 days', () => {
  assert.match(RETURNS.lead, /14 days/);
  assert.match(RETURNS.lead, /receipt/);
  assert.ok(SERVICE.steps.some((s) => /90-day/.test(s.line)));
});

test('the questions Visit shows come first, and every answer is a full sentence', () => {
  assert.equal(QUESTIONS[0].q, 'Who installs what I buy?');
  for (const { q, a } of QUESTIONS) {
    assert.match(q, /\?$/);
    assert.match(a, /\.$/);
  }
});
