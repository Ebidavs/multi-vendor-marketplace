const mongoose = require('mongoose');
const { User } = require('../models/user');
const Review = require('../models/review');
const Product = require('../models/product');

// Single source of truth for how a product's rating aggregates are computed.
// A review contributes to the product rating only when the review is active
// (isActive: true) and was written by a customer whose account is active and
// not soft-deleted. This matches the public review listing, so the displayed
// reviews and the rating figures always agree.
//
// `extraActiveCustomerIds` lets a caller include a customer who is being
// reactivated in the same request, before their isActive flag is persisted.
const recalculateProductRating = async (
  productId,
  { extraActiveCustomerIds = [] } = {}
) => {
  const productObjectId = mongoose.Types.ObjectId.isValid(productId)
    ? new mongoose.Types.ObjectId(productId)
    : productId;

  const activeCustomerIds = await User.find({
    role: 'customer',
    isActive: true,
    deletedAt: null,
  }).distinct('_id');

  if (extraActiveCustomerIds.length > 0) {
    activeCustomerIds.push(...extraActiveCustomerIds);
  }

  const stats = await Review.aggregate([
    {
      $match: {
        product: productObjectId,
        isActive: true,
        user: { $in: activeCustomerIds },
      },
    },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  await Product.findByIdAndUpdate(productObjectId, {
    ratingsAverage: stats.length > 0 ? Math.round(stats[0].avgRating * 10) / 10 : 0,
    ratingsCount: stats.length > 0 ? stats[0].count : 0,
  });
};

module.exports = { recalculateProductRating };
