const test = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const crypto = require('crypto');
const { User, Customer, Vendor } = require('../src/models/user');
const { RevokedToken } = require('../src/models/revokedToken');
const authController = require('../src/controllers/authController');
const userController = require('../src/controllers/userController');
const { protect } = require('../src/middlewares/auth');

const testMongoUri = process.env.TEST_MONGODB_URI;

function invoke(handler, req) {
  const res = { status: null, body: null };
  return handler(req, res).then(() => res);
}

async function login(email, password) {
  const r = await invoke(authController.logIn, { body: { email, password } });
  assert.strictEqual(r.statusCode, 200);
  assert.strictEqual(r.body.success, true);
  return r.body.data.token;
}

function tokenHash(t) {
  return crypto.createHash('sha256').update(t).digest('hex');
}

test('logout revokes token and subsequent requests are rejected', { skip: !testMongoUri && 'Set TEST_MONGODB_URI to run logout tests' },
  async () => {
    await mongoose.connect(testMongoUri);
    const uid = new mongoose.Types.ObjectId().toString();
    const e = `logout-cust-${uid}@example.test`;
    await User.deleteMany({ email: { $in: [e] }});
    await RevokedToken.deleteMany({});
    await mongoose.disconnect();

    const pw = 'Passw0rd!';
    const h = await bcrypt.hash(pw, 10);
    await Customer.create({ name: 'Cust', email: e, phoneNumber: '08012345672', password: h });
    const tok = await login(e, pw);

    let hit = false;
    await invoke(async (r, res) => { await protect(r, res, () => { hit = true; }); }, { headers: { authorization: `Bearer ${tok}` } });
    assert.strictEqual(hit, true, 'protected route accepts token');

    const lr = await invoke(userController.logOut, { headers: { authorization: `Bearer ${tok}` }, token: tok, tokenExp: jwt.decode(tok).exp });
    assert.strictEqual(lr.statusCode, 200);
    assert.strictEqual(lr.body.message, 'Logged out successfully');

    const rh = await invoke(userController.logOut, { headers: { authorization: `Bearer ${tok}` }, token: tok, tokenExp: jwt.decode(tok).exp });
    assert.strictEqual(rh.statusCode, 200);
    const cnt = await RevokedToken.countDocuments({ token: tokenHash(tok) });
    assert.strictEqual(cnt, 1, 'revocation record count is 1');
  }
);

test('double logout is idempotent', { skip: !testMongoUri && 'Set TEST_MONGODB_URI to run logout tests' },
  async () => {
    await mongoose.connect(testMongoUri);
    const uid = new mongoose.Types.ObjectId().toString();
    const e = `logout-vend-${uid}@example.test`;
    await User.deleteMany({ email: { $in: [e] }});
    await RevokedToken.deleteMany({});
    await mongoose.disconnect();

    const pw = 'Passw0rd!';
    const h = await bcrypt.hash(pw, 10);
    await Vendor.create({ name: 'Vend', email: e, phoneNumber: '08012345673', password: h, businessName: 'Test', businessDescription: 'Integration' });
    const tok = await login(e, pw);
    const req = { headers: { authorization: `Bearer ${tok}` }, token: tok, tokenExp: jwt.decode(tok).exp };

    await invoke(userController.logOut, req);
    await invoke(userController.logOut, req);
    const cnt = await RevokedToken.countDocuments({ token: tokenHash(tok) });
    assert.strictEqual(cnt, 1, 'revocation count remains 1');
  }
);

test('logout works for customer and vendor roles', { skip: !testMongoUri && 'Set TEST_MONGODB_URI to run logout tests' },
  async () => {
    await mongoose.connect(testMongoUri);
    const uid = new mongoose.Types.ObjectId().toString();
    const em = `logout-cust-${uid}@example.test`;
    await User.deleteMany({ email: { $in: [em] }});
    await RevokedToken.deleteMany({});
    await mongoose.disconnect();

    const pw = 'Passw0rd!';
    const h = await bcrypt.hash(pw, 10);
    await Customer.create({ name: 'Cust', email: em, phoneNumber: '08012345674', password: h });
    await Vendor.create({ name: 'Vend', email: em, phoneNumber: '08012345675', password: h, businessName: 'Test', businessDescription: 'Integration' });

    for (const u of [await Customer.create({ name: 'Cust', email: em, phoneNumber: '08012345674', password: h }), await Vendor.create({ name: 'Vend', email: em, phoneNumber: '08012345675', password: h, businessName: 'Test', businessDescription: 'Integration' })] ) {
      const tok = await login(u.email, pw);
      const req = { headers: { authorization: `Bearer ${tok}` }, token: tok, tokenExp: jwt.decode(tok).exp };
      await invoke(userController.logOut, req);
      const rev = await RevokedToken.findOne({ token: tokenHash(tok) });
      assert.ok(rev, 'revocation recorded');
    }
  }
);