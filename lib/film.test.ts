import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FILM, chapterById, coverPoint, filmProgress, formatHour, frameAt, framePath, hourAt } from './film.ts';

test('a point in the frame lands on screen through the cover crop', () => {
  // 1920x1080 frame on a 1440x900 screen: scaled to 1600x900, 80px cropped off each side.
  assert.deepEqual(coverPoint([0.5, 0.5], [1920, 1080], [1440, 900]), [720, 450]);
  const [x, y] = coverPoint([0.763, 0.4725], [1920, 1080], [1440, 900]);
  assert.ok(Math.abs(x - 1140.8) < 0.01);
  assert.ok(Math.abs(y - 425.25) < 0.01);
  // A portrait frame on a wider screen crops top and bottom instead.
  assert.deepEqual(coverPoint([0.5, 0], [1080, 1440], [390, 400]), [195, -60]);
});

test('a hold keeps the film on its last frame for the end of the chapter', () => {
  assert.equal(filmProgress(0, 3.2, 0.9), 0);
  assert.equal(filmProgress(0.5, 3.2, 0.9), 0.640625);
  assert.equal(filmProgress(0.78, 3.2, 0.9), 0.999375);
  assert.equal(filmProgress(0.9, 3.2, 0.9), 1);
  assert.equal(filmProgress(0.4, 2.2, 0), 0.4);
});

test('every chapter knows where its product sits for the marker', () => {
  for (const c of FILM) {
    for (const size of ['d', 'm'] as const) {
      const [x, y] = c.spot[size];
      assert.ok(x > 0 && x < 1 && y > 0 && y < 1, `${c.id} ${size}`);
    }
  }
});

test('the film runs one day, dawn to the next morning', () => {
  assert.deepEqual(
    FILM.map((c) => c.id),
    ['dawn', 'noon', 'heat', 'afternoon', 'dusk', 'night', 'outage', 'morning'],
  );
});

test('each chapter starts at the hour the previous one ends', () => {
  for (let i = 1; i < FILM.length; i++) assert.equal(FILM[i].hours[0], FILM[i - 1].hours[1], FILM[i].id);
});

test('every chapter has frames for desktop and phone', () => {
  for (const c of FILM) {
    assert.ok(c.frames.d > 1, `${c.id} desktop`);
    assert.ok(c.frames.m > 1, `${c.id} phone`);
  }
});

test('progress picks a frame and the mix toward the next one', () => {
  assert.deepEqual(frameAt(0, 61), { i: 0, t: 0 });
  assert.deepEqual(frameAt(0.5, 61), { i: 30, t: 0 });
  assert.deepEqual(frameAt(1, 61), { i: 60, t: 0 });
  const mid = frameAt(0.0125, 61);
  assert.equal(mid.i, 0);
  assert.ok(Math.abs(mid.t - 0.75) < 1e-9);
});

test('out-of-range progress and empty sequences are safe', () => {
  assert.deepEqual(frameAt(-2, 10), { i: 0, t: 0 });
  assert.deepEqual(frameAt(9, 10), { i: 9, t: 0 });
  assert.deepEqual(frameAt(Number.NaN, 10), { i: 0, t: 0 });
  assert.deepEqual(frameAt(0.5, 0), { i: 0, t: 0 });
});

test('the hour moves through a chapter and wraps past midnight', () => {
  const dawn = chapterById('dawn')!;
  assert.equal(hourAt(dawn, 0), dawn.hours[0]);
  assert.equal(hourAt(dawn, 1), dawn.hours[1]);
  const morning = chapterById('morning')!;
  assert.ok(hourAt(morning, 1) < 24);
  assert.equal(formatHour(31), '07:00');
  assert.equal(formatHour(18.5), '18:30');
  assert.equal(formatHour(5.75), '05:45');
});

test('frame files are numbered from 0001 per chapter and size', () => {
  assert.equal(framePath('noon', 'd', 0), '/film/d/noon/0001.webp');
  assert.equal(framePath('dusk', 'm', 41), '/film/m/dusk/0042.webp');
});

test('unknown chapters are not found', () => {
  assert.equal(chapterById('lunch' as never), undefined);
});
