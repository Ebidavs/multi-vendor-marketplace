const express = require('express');
const { body } = require('express-validator');
const { createCategory, getCategories } = require('../controllers/categoryController');
const { protect, restrictTo } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/',
  protect,
  restrictTo('admin'),
  [body('name').trim().notEmpty().withMessage('Category name is required')],
  validate,
  createCategory
);

router.get('/', getCategories);

module.exports = router;