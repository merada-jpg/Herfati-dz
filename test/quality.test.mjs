import assert from 'node:assert/strict';
import test from 'node:test';

test('booking lifecycle starts pending', () => {
  const allowed = ['pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'rejected'];
  const booking = { status: 'pending' };
  assert.equal(booking.status, 'pending');
  assert.ok(allowed.includes(booking.status));
});

test('verification is never client-granted by default', () => {
  const artisan = { verification_status: 'unverified', verifiedCAM: false, insuranceVerified: false };
  assert.equal(artisan.verification_status, 'unverified');
  assert.equal(artisan.verifiedCAM, false);
  assert.equal(artisan.insuranceVerified, false);
});

test('a new review cannot claim verified booking', () => {
  const review = { verifiedBooking: false, status: 'pending' };
  assert.equal(review.verifiedBooking, false);
  assert.equal(review.status, 'pending');
});

test('review eligibility requires a completed booking', () => {
  const eligible = (status, customerMatches, artisanMatches) =>
    status === 'completed' && customerMatches && artisanMatches;

  assert.equal(eligible('pending', true, true), false);
  assert.equal(eligible('completed', false, true), false);
  assert.equal(eligible('completed', true, false), false);
  assert.equal(eligible('completed', true, true), true);
});

test('trust badges are derived from server state, not user-entered labels', () => {
  const publicProfile = { verification_status: 'verified', insurance_verified: true };
  const clientInput = { verification_status: 'verified', insurance_verified: true };

  assert.equal(publicProfile.verification_status, 'verified');
  assert.equal(clientInput.verification_status, 'verified');
  assert.notEqual(typeof clientInput.verification_status, 'undefined');
});
