const express = require('express');
const { query } = require('express-validator');

const router = express.Router();

const { protect, restrictTo } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const orderController = require('../controllers/orderController');

// GET /api/v1/vendors/orders
// Orders placed against the authenticated vendor's shop.
router.get(
  '/orders',
  protect,
  restrictTo('vendor'),
  [
    query('status')
      .optional()
      .isIn(['pending', 'processing', 'shipped', 'delivered'])
      .withMessage('Invalid order status'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  ],
  validate,
  orderController.getVendorOrders
);

module.exports = router;
