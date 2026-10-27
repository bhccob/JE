import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STORE, arubaNow, clock, hoursOn, openState } from './store.ts';

test('clock hours read the way the site writes them', () => {
  assert.equal(clock(9), '9:00 AM');
  assert.equal(clock(19), '7:00 PM');
  assert.equal(clock(12), '12:00 PM');
  assert.equal(clock(18.5), '6:30 PM');
});

test('the opening hours are the owner\'s', () => {
  assert.equal(STORE.hours[0].time, '9:00 AM to 7:00 PM');
  assert.equal(STORE.hours[1].time, '10:00 AM to 2:00 PM');
  assert.equal(hoursOn(0).days, 'Sunday');
  assert.equal(hoursOn(3).days, 'Monday to Saturday');
});

test('Aruba time is UTC-4 whatever the visitor\'s zone', () => {
  // Monday 2026-10-26 02:30 UTC is Sunday 22:30 in Aruba.
  assert.deepEqual(arubaNow(new Date('2026-10-26T02:30:00Z')), { day: 0, hour: 22.5 });
});

test('open and closed lines follow the day\'s hours', () => {
  assert.deepEqual(openState(2, 10), { open: true, line: 'Open now, until 7:00 PM' });
  assert.deepEqual(openState(2, 8.5), { open: false, line: 'Closed now, opens at 9:00 AM' });
  assert.deepEqual(openState(6, 19), { open: false, line: 'Closed now, opens tomorrow at 10:00 AM' });
  assert.deepEqual(openState(0, 13.9), { open: true, line: 'Open now, until 2:00 PM' });
  assert.deepEqual(openState(0, 15), { open: false, line: 'Closed now, opens tomorrow at 9:00 AM' });
});
