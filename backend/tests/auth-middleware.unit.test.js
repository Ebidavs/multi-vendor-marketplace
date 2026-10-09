const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const protect = require('../src/middlewares/auth').protect;

// Mock req/res pair used by every assertion below.
function makeRes() {
  const calls = { status: null, body: null };
  return {
    status(code) { calls.status = code; return this; },
    json(body) { calls.body = body; return this; },
    calls,
  };
}

const SECRET = process.env.JWT_SECRET || 'test-secret';
const EXPIRES_IN = process.env.EXPIRES_IN || '1h';

function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

// Helper: stub both RevokedToken.findOne and User.findById on the models
// that protect imports. Returns a restore function.
function withStubs({ revokedResult = null, userResult = null } = {}) {
  const revMod = require('../src/models/revokedToken');
  const userMod = require('../src/models/user');
  const origRevokedFindOne = revMod.RevokedToken.findOne;
  const origUserFindById = userMod.User.findById;
  revMod.RevokedToken.findOne = async () => revokedResult;
  userMod.User.findById = async () => userResult;
  return () => {
    revMod.RevokedToken.findOne = origRevokedFindOne;
    userMod.User.findById = origUserFindById;
  };
}

test('protect rejects requests without an Authorization header', async () => {
  const restore = withStubs({ revokedResult: null, userResult: null });
  try {
    const req = { headers: {} };
    const res = makeRes();
    await protect(req, res, () => {});
    assert.strictEqual(res.calls.status, 401);
    assert.strictEqual(res.calls.body.success, false);
    assert.match(res.calls.body.message, /Invalid or missing bearer token/);
  } finally {
    restore();
  }
});

test('protect rejects requests with a malformed token', async () => {
  const restore = withStubs({ revokedResult: null, userResult: null });
  try {
    const req = { headers: { authorization: 'Bearer not.a.jwt' } };
    const res = makeRes();
    await protect(req, res, () => {});
    assert.strictEqual(res.calls.status, 401);
    assert.match(res.calls.body.message, /Invalid or expired token/);
  } finally {
    restore();
  }
});

test('protect rejects requests with an expired token', async () => {
  const restore = withStubs({ revokedResult: null, userResult: null });
  try {
    const token = jwt.sign(
      { id: '507f1f77bcf86cd799439011', role: 'customer' },
      SECRET,
      { expiresIn: '0s' }
    );
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = makeRes();
    await protect(req, res, () => {});
    assert.strictEqual(res.calls.status, 401);
    assert.match(res.calls.body.message, /Invalid or expired token/);
  } finally {
    restore();
  }
});

test('protect rejects a token whose SHA-256 hash is in the revocation list', async () => {
  const restore = withStubs({
    revokedResult: { _id: 'revoked' },
    userResult: { _id: '507f1f77bcf86cd799439011', role: 'customer', deletedAt: null, isActive: true },
  });
  try {
    const token = signToken({ id: '507f1f77bcf86cd799439011', role: 'customer' });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = makeRes();
    await protect(req, res, () => {});
    assert.strictEqual(res.calls.status, 401);
    assert.match(res.calls.body.message, /Invalid or expired token/);
  } finally {
    restore();
  }
});

test('protect verifies the signature before querying the revocation list', async () => {
  // A malformed token must be rejected by signature verification alone,
  // even when the revocation lookup would throw (proving DB not hit).
  const restore = withStubs({
    revokedResult: (async () => { throw new Error('DB should not be called'); })(),
    userResult: null,
  });
  try {
    const req = { headers: { authorization: 'Bearer garbage' } };
    const res = makeRes();
    await protect(req, res, () => {});
    assert.strictEqual(res.calls.status, 401);
  } finally {
    restore();
  }
});

test('protect populates req.user, req.token and req.tokenExp on success', async () => {
  const fakeUser = {
    _id: '507f1f77bcf86cd799439011',
    role: 'vendor',
    deletedAt: null,
    isActive: true,
  };
  const restore = withStubs({
    revokedResult: null,
    userResult: fakeUser,
  });
  try {
    const token = signToken({ id: fakeUser._id, role: fakeUser.role });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = makeRes();
    let nextCalled = false;
    await protect(req, res, () => { nextCalled = true; });
    assert.ok(nextCalled);
    assert.strictEqual(req.token, token);
    assert.ok(req.tokenExp > Math.floor(Date.now() / 1000));
    assert.strictEqual(req.user, fakeUser);
    assert.strictEqual(req.user.role, 'vendor');
  } finally {
    restore();
  }
});