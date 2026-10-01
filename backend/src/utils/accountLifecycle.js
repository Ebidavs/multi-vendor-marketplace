const { User } = require('../models/user');
const Address = require('../models/address');
const Shop = require('../models/shop');
const Review = require('../models/review');
const Product = require('../models/product');

const setRelatedResourcesActive = async (user, isActive) => {
  const userId = user._id;
  const affectedProductIds = await Review.distinct('product', { user: userId });

  await Promise.all([
    Address.updateMany({ user: userId }, { $set: { isActive } }),
    Shop.updateMany({ owner: userId }, { $set: { isActive } }),
    Review.updateMany({ user: userId }, { $set: { isActive } }),
  ]);

  if (affectedProductIds.length === 0) return;

  const activeCustomerIds = await User.find({
    role: 'customer',
    isActive: true,
    deletedAt: null,
  }).distinct('_id');
  if (isActive && user.role === 'customer') {
    activeCustomerIds.push(userId);
  }

  await Promise.all(affectedProductIds.map(async (productId) => {
    const stats = await Review.aggregate([
      {
        $match: {
          product: productId,
          isActive: { $ne: false },
          user: { $in: activeCustomerIds },
        },
      },
      {
        $group: {
          _id: '$product',
          average: { $avg: '$rating' },
          count: { $sum: 1 },
        },
      },
    ]);

    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: stats.length ? Math.round(stats[0].average * 10) / 10 : 0,
      ratingsCount: stats.length ? stats[0].count : 0,
    });
  }));
};

module.exports = { setRelatedResourcesActive };