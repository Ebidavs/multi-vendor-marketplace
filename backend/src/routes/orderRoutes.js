const express = require('express');
const { body, param, query } = require('express-validator');
const router = express.Router();

const { protect, restrictTo } = require('../middlewares/auth'); // From Dev 1
const validate = require('../middlewares/validate');
const orderController = require('../controllers/orderController');

router.get('/cart', protect, restrictTo('customer'), orderController.getCart);
router.post(
  '/cart/items',
  protect,
  restrictTo('customer'),
  [
    body('productId').isMongoId().withMessage('A valid product id is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  ],
  validate,
  orderController.addToCart
);
router.put(
  '/cart/items/:itemId',
  protect,
  restrictTo('customer'),
  [
    param('itemId').isMongoId().withMessage('Invalid cart item id'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  ],
  validate,
  orderController.updateCartItem
);
router.delete(
  '/cart/items/:itemId',
  protect,
  restrictTo('customer'),
  [param('itemId').isMongoId().withMessage('Invalid cart item id')],
  validate,
  orderController.removeCartItem
);
router.delete('/cart', protect, restrictTo('customer'), orderController.clearCart);
router.post(
  '/orders',
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
router.get(
  '/orders',
  protect,
  restrictTo('customer'),
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  ],
  validate,
  orderController.getOrders
);
router.get(
  '/orders/:orderId',
  protect,
  restrictTo('customer'),
  [param('orderId').isMongoId().withMessage('Invalid order id')],
  validate,
  orderController.getOrderDetails
);
router.put(
  '/orders/:orderId/status',
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

router.get(
  '/vendors/orders',
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