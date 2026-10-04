const express = require('express');
const { body, param } = require('express-validator');

const router = express.Router();

const { protect, restrictTo } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const orderController = require('../controllers/orderController');

// Every cart endpoint belongs to the authenticated customer.
router.use(protect, restrictTo('customer'));

// GET /api/v1/cart
router.get('/', orderController.getCart);

// POST /api/v1/cart/items
router.post(
  '/items',
  [
    body('productId').isMongoId().withMessage('A valid product id is required'),
    body('quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be a positive integer'),
  ],
  validate,
  orderController.addToCart
);

// PUT /api/v1/cart/items/:itemId
router.put(
  '/items/:itemId',
  [
    param('itemId').isMongoId().withMessage('Invalid cart item id'),
    body('quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be a positive integer'),
  ],
  validate,
  orderController.updateCartItem
);

// DELETE /api/v1/cart/items/:itemId
router.delete(
  '/items/:itemId',
  [param('itemId').isMongoId().withMessage('Invalid cart item id')],
  validate,
  orderController.removeCartItem
);

// DELETE /api/v1/cart
router.delete('/', orderController.clearCart);

module.exports = router;
