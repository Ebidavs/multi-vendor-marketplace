const express = require('express');
const { body, param, query } = require('express-validator');

const router = express.Router();

const { protect, restrictTo } = require('../middlewares/auth'); // From Dev 1
const validate = require('../middlewares/validate');
const orderController = require('../controllers/orderController');

// POST /api/v1/orders
router.post(
  '/',
  protect,
  restrictTo('customer'),
  [
    body('shippingAddress').isObject().withMessage('Shipping address is required'),
    body('shippingAddress.fullName').trim().notEmpty().withMessage('Full name is required'),
    body('shippingAddress.phone').trim().notEmpty().withMessage('Phone number is required'),
    body('shippingAddress.street').trim().notEmpty().withMessage('Street is required'),
    body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
    body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
    body('shippingAddress.country').optional().trim(),
    body('paymentMethod')
      .isIn(['credit_card', 'bank_transfer', 'cash_on_delivery'])
      .withMessage('Invalid payment method'),
  ],
  validate,
  orderController.createOrder
);

// GET /api/v1/orders
router.get(
  '/',
  protect,
  restrictTo('customer'),
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  ],
  validate,
  orderController.getOrders
);

// GET /api/v1/orders/:orderId
router.get(
  '/:orderId',
  protect,
  restrictTo('customer'),
  [param('orderId').isMongoId().withMessage('Invalid order id')],
  validate,
  orderController.getOrderDetails
);

// PUT /api/v1/orders/:orderId/status
router.put(
  '/:orderId/status',
  protect,
  restrictTo('vendor'),
  [
    param('orderId').isMongoId().withMessage('Invalid order id'),
    body('status')
      .isIn(['pending', 'processing', 'shipped', 'delivered'])
      .withMessage('Invalid order status'),
  ],
  validate,
  orderController.updateOrderStatus
);

module.exports = router;
