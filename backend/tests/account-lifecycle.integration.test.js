const test = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { User, Customer, Vendor } = require('../src/models/user');
const Address = require('../src/models/address');
const Category = require('../src/models/category');
const Product = require('../src/models/product');
const Review = require('../src/models/review');
const Shop = require('../src/models/shop');
const { Otp } = require('../src/models/otp');
const authController = require('../src/controllers/authController');
const userController = require('../src/controllers/userController');

const testMongoUri = process.env.TEST_MONGODB_URI;

test(
  'account lifecycle cascades retained resources and preserves product soft-delete state',
  { skip: !testMongoUri && 'Set TEST_MONGODB_URI to run the account lifecycle integration test' },
  async (t) => {
    await mongoose.connect(testMongoUri);
    const unique = new mongoose.Types.ObjectId().toString();
    const customerEmail = `lifecycle-customer-${unique}@example.test`;
    const vendorEmail = `lifecycle-vendor-${unique}@example.test`;
    let customer;
    let vendor;
    let category;
    let product;
    let shop;
    let address;
    let review;

    t.after(async () => {
      if (review) await Review.deleteOne({ _id: review._id });
      if (address) await Address.deleteOne({ _id: address._id });
      if (product) await Product.deleteOne({ _id: product._id });
      if (shop) await Shop.deleteOne({ _id: shop._id });
      if (category) await Category.deleteOne({ _id: category._id });
      if (customer) await User.deleteOne({ _id: customer._id });
      if (vendor) await User.deleteOne({ _id: vendor._id });
      await Otp.deleteMany({ email: { $in: [customerEmail, vendorEmail] } });
      await mongoose.disconnect();
    });

    customer = await Customer.create({
      name: 'Lifecycle Customer',
      email: customerEmail,
      phoneNumber: '08012345670',
      password: 'hashed-test-password',
    });
    vendor = await Vendor.create({
      name: 'Lifecycle Vendor',
      email: vendorEmail,
      phoneNumber: '08012345671',
      password: 'hashed-test-password',
      businessName: 'Lifecycle Shop',
      businessDescription: 'Vendor fixture for lifecycle integration.',
    });
    category = await Category.create({ name: `Lifecycle ${unique}` });
    shop = await Shop.create({ owner: vendor._id, name: 'Lifecycle Shop' });
    product = await Product.create({
      name: 'Lifecycle Product',
      description: 'Product state must remain independent from account state.',
      price: 25,
      stock: 4,
      category: category._id,
      vendor: vendor._id,
      isActive: true,
      ratingsAverage: 5,
      ratingsCount: 1,
    });
    address = await Address.create({
      user: customer._id,
      fullName: 'Lifecycle Customer',
      phone: '08012345670',
      street: '1 Test Street',
      city: 'Lagos',
      state: 'Lagos',
    });
    review = await Review.create({
      user: customer._id,
      product: product._id,
      rating: 5,
      comment: 'Lifecycle review',
    });

    const invoke = async (handler, req) => {
      let response;
      const res = {
        status(code) {
          this.statusCode = code;
          return this;
        },
        json(body) {
          response = body;
          return body;
        },
      };
      await handler(req, res);
      return { response, statusCode: res.statusCode || 200 };
    };

    await invoke(userController.deactivateAccount, { user: vendor });
    assert.equal((await User.findById(vendor._id)).deletedAt, null);
    assert.equal((await Shop.findById(shop._id)).isActive, false);
    assert.equal((await Product.findById(product._id)).isActive, true);

    const reactivateVendorOtp = '123456';
    await Otp.create({
      email: vendorEmail,
      otp: await bcrypt.hash(reactivateVendorOtp, 10),
      purpose: 'account-reactivation',
      expiresAt: new Date(Date.now() + 60_000),
    });
    await invoke(authController.activateAccount, {
      body: { email: vendorEmail, otp: reactivateVendorOtp },
    });
    assert.equal((await User.findById(vendor._id)).isActive, true);
    assert.equal((await Shop.findById(shop._id)).isActive, true);
    assert.equal((await Product.findById(product._id)).isActive, true);

    await invoke(userController.deactivateAccount, { user: customer });
    assert.equal((await Address.findById(address._id)).isActive, false);
    assert.equal((await Review.findById(review._id)).isActive, false);
    assert.equal((await Product.findById(product._id)).ratingsCount, 0);

    const reactivateCustomerOtp = '654321';
    await Otp.create({
      email: customerEmail,
      otp: await bcrypt.hash(reactivateCustomerOtp, 10),
      purpose: 'account-reactivation',
      expiresAt: new Date(Date.now() + 60_000),
    });
    await invoke(authController.activateAccount, {
      body: { email: customerEmail, otp: reactivateCustomerOtp },
    });
    assert.equal((await Address.findById(address._id)).isActive, true);
    assert.equal((await Review.findById(review._id)).isActive, true);
    assert.equal((await Product.findById(product._id)).ratingsAverage, 5);
    assert.equal((await Product.findById(product._id)).ratingsCount, 1);

    await invoke(userController.deleteAccount, { user: customer });
    const deletedCustomer = await User.findById(customer._id);
    assert.equal(deletedCustomer.isActive, false);
    assert.ok(deletedCustomer.deletedAt instanceof Date);
    assert.equal((await Address.findById(address._id)).isActive, false);
    assert.equal((await Review.findById(review._id)).isActive, false);
    assert.equal((await Product.findById(product._id)).ratingsCount, 0);
  }
);