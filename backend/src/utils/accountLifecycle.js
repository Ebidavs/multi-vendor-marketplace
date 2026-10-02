const Address = require('../models/address');
const Shop = require('../models/shop');
const Review = require('../models/review');
const { recalculateProductRating } = require('./productRating');

const setRelatedResourcesActive = async (user, isActive) => {
  const userId = user._id;
  const affectedProductIds = await Review.distinct('product', { user: userId });

  await Promise.all([
    Address.updateMany({ user: userId }, { $set: { isActive } }),
    Shop.updateMany({ owner: userId }, { $set: { isActive } }),
    Review.updateMany({ user: userId }, { $set: { isActive } }),
  ]);

  if (affectedProductIds.length === 0) return;

  // A customer being reactivated has their reviews restored above, before the
  // account's isActive flag is persisted, so include them explicitly here.
  const extraActiveCustomerIds =
    isActive && user.role === 'customer' ? [userId] : [];

  await Promise.all(
    affectedProductIds.map((productId) =>
      recalculateProductRating(productId, { extraActiveCustomerIds })
    )
  );
};

module.exports = { setRelatedResourcesActive };
