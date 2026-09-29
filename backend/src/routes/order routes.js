const express = require('express');
const router = express.Router();
const orderController = require('../controllers/ordercontroller');
const auth = require('../middleware/auth'); // From Dev 1
// ===== CART ROUTES =====
router.get('/cart', auth, orderController.getCart);
router.post('/cart/items', auth, orderController.addToCart);
router.put('/cart/items/:itemId', auth,
orderController.updateCartItem);
router.delete('/cart/items/:itemId', auth,
orderController.removeFromCart);
router.delete('/cart', auth, orderController.clearCart);
// ===== ORDER ROUTES =====
router.post('/orders', auth, orderController.createOrder);
router.get('/orders', auth, orderController.getCustomerOrders);
router.get('/orders/:orderId', auth, orderController.getOrderDetails);
router.put('/orders/:orderId/status', auth,
orderController.updateOrderStatus);
router.get('/vendors/orders', auth, orderController.getVendorOrders);
module.exports = router;