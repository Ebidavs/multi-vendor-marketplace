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

  // categories are usually a small, fixed list, so counting per category
  // like this stays fast. if that list grows into the hundreds, switch to
  // one Product.aggregate grouped by category instead

  const categoriesWithCount = await Promise.all(
    categories.map(async (category) => {
      const productCount = await Product.countDocuments({
        category: category._id,
        isActive: true,
      });
      return formatCategory(category, productCount);
    })
  );

  sendSuccess(res, 200, 'Categories fetched successfully', categoriesWithCount);
};