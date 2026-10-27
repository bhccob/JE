import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DIRECTIONS_URL, whatsappLink } from './contact.ts';

test('a WhatsApp link carries its question, encoded', () => {
  assert.equal(whatsappLink('Ask about furniture delivery'), 'https://wa.me/2975865323?text=Ask%20about%20furniture%20delivery');
});

test('a bare WhatsApp link has no query', () => {
  assert.equal(whatsappLink(), 'https://wa.me/2975865323');
  assert.equal(whatsappLink(''), 'https://wa.me/2975865323');
});

test('directions point at the store address', () => {
  assert.match(DIRECTIONS_URL, /^https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=/);
  assert.match(DIRECTIONS_URL, /Cumana%2073/);
});
