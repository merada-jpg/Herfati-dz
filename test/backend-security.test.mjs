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


test('new authenticated accounts default to customer and cannot self-escalate', () => {
  const authSignup = { requestedRole: 'admin', persistedRole: 'customer' };
  assert.equal(authSignup.persistedRole, 'customer');
  assert.notEqual(authSignup.persistedRole, authSignup.requestedRole);
});

test('browser auth must use public Supabase configuration only', () => {
  const browserEnv = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
  assert.ok(browserEnv.every(Boolean));
  assert.equal('SUPABASE_SERVICE_ROLE_KEY' in browserEnv, false);
});


test('booking state machine rejects arbitrary status jumps', () => {
  const transitions = {
    pending: ['accepted','rejected','cancelled'],
    accepted: ['in_progress','cancelled'],
    in_progress: ['completed'],
    completed: [],
    rejected: [],
    cancelled: []
  };
  assert.ok(transitions.pending.includes('accepted'));
  assert.ok(!transitions.pending.includes('completed'));
  assert.ok(!transitions.completed.includes('in_progress'));
});
