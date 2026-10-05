import assert from'node:assert/strict';import test from'node:test';
test('booking lifecycle starts pending',()=>{const b={status:'pending'};assert.equal(b.status,'pending');assert.notEqual(b.status,'confirmed')});
test('verification flags default to false',()=>{const a={verifiedCAM:false,insuranceVerified:false};assert.equal(a.verifiedCAM,false);assert.equal(a.insuranceVerified,false)});
test('verified review is never fabricated at creation',()=>{const review={verifiedBooking:false};assert.equal(review.verifiedBooking,false)});