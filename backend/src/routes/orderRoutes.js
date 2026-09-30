const express = require('express');
const router = express.Router();

const { protect, restrictTo } = require('../middlewares/auth'); // From Dev 1
const orderController = require('../controllers/orderController');

router.get('/cart', protect, orderController.getCart);
router.post('/cart/items', protect, orderController.addToCart);
router.put('/cart/items/:itemId', protect, orderController.updateCartItem);
router.delete('/cart/items/:itemId', protect, orderController.removeCartItem);
router.delete('/cart', protect, orderController.clearCart);
router.post('/orders', protect, orderController.createOrder);
router.get('/orders', protect, orderController.getOrders);
router.get('/orders/:orderId', protect, orderController.getOrderDetails);
router.put(
  '/orders/:orderId/status',
  protect,
  restrictTo('vendor'),
  orderController.updateOrderStatus
);

router.get(
  '/vendors/orders',
  protect,
  restrictTo('vendor'),
  orderController.getVendorOrders
);

module.exports = router;