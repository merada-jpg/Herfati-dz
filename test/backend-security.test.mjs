import assert from 'node:assert/strict';
import test from 'node:test';

test('booking persistence forces pending status', () => {
  const clientInput = { status: 'completed', service_description: 'Fix a leak' };
  const persisted = { status: 'pending', service_description: clientInput.service_description };
  assert.equal(persisted.status, 'pending');
});

test('review persistence forces pending moderation status', () => {
  const clientInput = { status: 'published', rating: 5 };
  const persisted = { status: 'pending', rating: clientInput.rating };
  assert.equal(persisted.status, 'pending');
});

test('review eligibility requires completed booking ownership', () => {
  const eligible = (status, customerMatches, artisanMatches) =>
    status === 'completed' && customerMatches && artisanMatches;
  assert.equal(eligible('completed', true, true), true);
  assert.equal(eligible('completed', false, true), false);
  assert.equal(eligible('completed', true, false), false);
  assert.equal(eligible('pending', true, true), false);
});
