const cloudinary = require('../config/cloudinary');

// deletes one or more images from cloudinary storage, e.g. when a
// product's images are replaced or the product itself is deleted.
// takes an array of public_ids (the ones saved on Product.imagePublicIds)
const deleteFromCloudinary = async (publicIds) => {
  if (!publicIds || publicIds.length === 0) return;
  await cloudinary.api.delete_resources(publicIds);
};

module.exports = deleteFromCloudinary;