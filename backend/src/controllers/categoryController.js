const Category = require('../models/category');
const Product = require('../models/product');
const sendSuccess = require('../utils/response');
const formatCategory = require('../utils/formatCategory');

exports.createCategory = async (req, res, next) => {
  const { name, icon, description } = req.body;
  const category = await Category.create({ name, icon, description });
  sendSuccess(res, 201, 'Category created successfully', formatCategory(category));
};

exports.getCategories = async (req, res, next) => {
  const categories = await Category.find().sort({ name: 1 });

  const productCounts = await Product.aggregate([
    {
      $match: {
        category: { $in: categories.map((category) => category._id) },
        isActive: true,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'vendor',
        foreignField: '_id',
        as: 'vendor',
      },
    },
    { $unwind: '$vendor' },
    {
      $match: {
        'vendor.role': 'vendor',
        'vendor.isActive': true,
        'vendor.deletedAt': null,
      },
    },
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);

  const productCountByCategory = new Map(
    productCounts.map(({ _id, count }) => [_id.toString(), count])
  );
  const categoriesWithCount = categories.map((category) =>
    formatCategory(category, productCountByCategory.get(category.id) || 0)
  );

  sendSuccess(res, 200, 'Categories fetched successfully', categoriesWithCount);
};