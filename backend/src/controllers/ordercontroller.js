const Cart = require('../models/cart');
const Order = require('../models/order');
const OrderItems = require('../models/orderitems');
const Product = require('../models/Product');
const Shop = require('../models/Shop');
// ===== CART FUNCTIONS =====
// 1. GET /api/cart
exports.getCart = async (req, res) => {
 try {
 const userId = req.user.id;
 let cart = await
Cart.findOne({ userId }).populate('items.productId');
 if (!cart) {
 cart = await Cart.create({ userId, items: [] });
 }
 res.json({
 success: true,
 message: 'Cart retrieved',
 data: cart
 });
 } catch (error) {
 res.status(500).json({
 success: false,
 message: 'Error retrieving cart',
 data: null
 });
 }
};
// 2. POST /api/cart/items
exports.addToCart = async (req, res) => {
 try {
 const userId = req.user.id;
 const { productId, quantity } = req.body;
 if (!productId || !quantity) {
 return res.status(400).json({
 success: false,
 message: 'Product ID and quantity required',
 data: null
 });
 }
 if (quantity < 1) {
 return res.status(400).json({
 success: false,
 message: 'Quantity must be greater than 0',
 data: null
 });
 }
 const product = await Product.findById(productId);
 if (!product) {
 return res.status(404).json({
 success: false,
 message: 'Product not found',
 data: null
 });
 }
 if (product.stock < quantity) {
 return res.status(400).json({
 success: false,
 message: `Insufficient stock. Only ${product.stock}
available`,
 data: null
 });
 }
 let cart = await Cart.findOne({ userId });
 if (!cart) {
 cart = await Cart.create({ userId, items: [] });
 }
 const existingItem = cart.items.find(
 item => item.productId.toString() === productId
 );
 if (existingItem) {
 existingItem.quantity += quantity;
 } else {
 cart.items.push({
 productId,
 quantity,
 price: product.price
 });
 }
 await cart.save();
 res.json({
 success: true,
 message: 'Item added to cart',
 data: cart
 });
 } catch (error) {
 res.status(500).json({
 success: false,
 message: 'Error adding to cart',
 data: null
 });
 }
};
// 3. PUT /api/cart/items/:itemId
exports.updateCartItem = async (req, res) => {
 try {
 const userId = req.user.id;
 const { itemId } = req.params;
 const { quantity } = req.body;
 if (quantity < 1) {
 return res.status(400).json({
 success: false,
 message: 'Quantity must be greater than 0',
 data: null
 });
 }
 const cart = await Cart.findOne({ userId });
 if (!cart) {
 return res.status(404).json({
 success: false,
 message: 'Cart not found',
 data: null
 });
 }
 const cartItem = cart.items.id(itemId);
 if (!cartItem) {
 return res.status(404).json({
 success: false,
 message: 'Item not found in cart',
 data: null
 });
 }
 const product = await Product.findById(cartItem.productId);
 if (product.stock < quantity) {
 return res.status(400).json({
 success: false,
 message: `Only ${product.stock} items available`,
 data: null
 });
 }
 cartItem.quantity = quantity;
 await cart.save();
 res.json({
 success: true,
 message: 'Cart item updated',
 data: cart
 });
 } catch (error) {
 res.status(500).json({
 success: false,
 message: 'Error updating cart',
 data: null
 });
 }
};
// 4. DELETE /api/cart/items/:itemId
exports.removeFromCart = async (req, res) => {
 try {
 const userId = req.user.id;
 const { itemId } = req.params;
 const cart = await Cart.findOne({ userId });
 if (!cart) {
 return res.status(404).json({
 success: false,
 message: 'Cart not found',
 data: null
 });
 }
 const initialLength = cart.items.length;
 cart.items = cart.items.filter(item => item._id.toString() !==
itemId);
 if (cart.items.length === initialLength) {
 return res.status(404).json({
 success: false,
 message: 'Item not found in cart',
 data: null
 });
 }
 await cart.save();
 res.json({
 success: true,
 message: 'Item removed from cart',
 data: cart
 });
 } catch (error) {
 res.status(500).json({
 success: false,
 message: 'Error removing from cart',
 data: null
 });
 }
};
// 5. DELETE /api/cart
exports.clearCart = async (req, res) => {
 try {
 const userId = req.user.id;
 const cart = await Cart.findOne({ userId });
 if (!cart) {
 return res.status(404).json({
 success: false,
 message: 'Cart not found',
 data: null
 });
 }
 cart.items = [];
 await cart.save();
 res.json({
 success: true,
 message: 'Cart cleared',
 data: cart
 });
 } catch (error) {
 res.status(500).json({
 success: false,
 message: 'Error clearing cart',
 data: null
 });
 }
};
// ===== ORDER FUNCTIONS =====
// 6. POST /api/orders ( MOST IMPORTANT) ⭐
exports.createOrder = async (req, res) => {
 try {
 const userId = req.user.id;
 const { shippingAddress, paymentMethod } = req.body;
 if (!shippingAddress || !shippingAddress.address || !
shippingAddress.city ||
 !shippingAddress.state || !shippingAddress.zipCode) {
 return res.status(400).json({
 success: false,
 message: 'Complete shipping address required',
 data: null
 });
 }
 const validMethods = ['credit_card', 'bank_transfer',
'cash_on_delivery'];
 if (!validMethods.includes(paymentMethod)) {
 return res.status(400).json({
 success: false,
 message: 'Invalid payment method',
 data: null
 });
 }
 const cart = await
Cart.findOne({ userId }).populate('items.productId');
 if (!cart || cart.items.length === 0) {
 return res.status(400).json({
 success: false,
 message: 'Cart is empty',
 data: null
 });
 }
 let totalAmount = 0;
 const orderItemsData = [];
 for (let item of cart.items) {
 const product = item.productId;
 if (product.stock < item.quantity) {
 return res.status(400).json({
 success: false,
 message: `${product.name} only has ${product.stock} in 
stock`,
 data: null
 });
 }
 totalAmount += product.price * item.quantity;
 orderItemsData.push({
 productId: product._id,
 quantity: item.quantity,
 priceAtPurchase: product.price
 });
 }
 const firstProduct = cart.items[0].productId;
 const shop = await Shop.findById(firstProduct.shopId);
 if (!shop) {
 return res.status(400).json({
 success: false,
 message: 'Shop not found',
 data: null
 });
 }
 const order = await Order.create({
 customerId: userId,
 shopId: shop._id,
 status: 'pending',
 totalAmount,
 shippingAddress,
 paymentMethod
 });
 for (let itemData of orderItemsData) {
 itemData.orderId = order._id;
 await OrderItems.create(itemData);
 await Product.findByIdAndUpdate(
 itemData.productId,
 { $inc: { stock: -itemData.quantity } }
 );
 }
 cart.items = [];
 await cart.save();
 res.status(201).json({
 success: true,
 message: 'Order created successfully',
 data: {
 orderId: order._id,
 status: order.status,
 totalAmount: order.totalAmount
 }
 });
 } catch (error) {
 res.status(500).json({
 success: false,
 message: 'Error creating order',
 data: null
 });
 }
};
// 7. GET /api/orders
exports.getCustomerOrders = async (req, res) => {
 try {
 const userId = req.user.id;
 const page = parseInt(req.query.page) || 1;
 const limit = parseInt(req.query.limit) || 10;
 const skip = (page - 1) * limit;
 const total = await Order.countDocuments({ customerId: userId });
 const orders = await Order.find({ customerId: userId })
 .sort({ createdAt: -1 })
 .skip(skip)
 .limit(limit);
 res.json({
 success: true,
 message: 'Orders retrieved',
 data: {
 items: orders,
 page,
 limit,
 total,
 pages: Math.ceil(total / limit)
 }
 });
 } catch (error) {
 res.status(500).json({
 success: false,
 message: 'Error retrieving orders',
 data: null
 });
 }
};
// 8. GET /api/orders/:orderId
exports.getOrderDetails = async (req, res) => {
 try {
 const userId = req.user.id;
 const { orderId } = req.params;
 const order = await Order.findById(orderId);
 if (!order) {
 return res.status(404).json({
 success: false,
 message: 'Order not found',
 data: null
 });
 }
 if (order.customerId.toString() !== userId) {
 return res.status(403).json({
 success: false,
 message: 'You can only view your own orders',
 data: null
 });
 }
 const orderItems = await OrderItems.find({ orderId })
 .populate('productId');
 res.json({
 success: true,
 message: 'Order retrieved',
 data: {
 ...order.toObject(),
 items: orderItems
 }
 });
 } catch (error) {
 res.status(500).json({
 success: false,
 message: 'Error retrieving order',
 data: null
 });
 }
};
// 9. PUT /api/orders/:orderId/status
exports.updateOrderStatus = async (req, res) => {
 try {
 const userId = req.user.id;
 const { orderId } = req.params;
 const { status } = req.body;
 const validStatuses = ['pending', 'processing', 'shipped',
'delivered'];
 if (!validStatuses.includes(status)) {
 return res.status(400).json({
 success: false,
 message: 'Invalid status',
 data: null
 });
 }
 const order = await Order.findById(orderId);
 if (!order) {
 return res.status(404).json({
 success: false,
 message: 'Order not found',
 data: null
 });
 }
 const shop = await Shop.findById(order.shopId);
 if (shop.userId.toString() !== userId) {
 return res.status(403).json({
 success: false,
 message: 'You can only update orders from your shop',
 data: null
 });
 }
 order.status = status;
 await order.save();
 res.json({
 success: true,
 message: 'Order status updated',
 data: order
 });
 } catch (error) {
 res.status(500).json({
 success: false,
 message: 'Error updating order status',
 data: null
 });
 }
};
// 10. GET /api/vendors/orders
exports.getVendorOrders = async (req, res) => {
 try {
 const userId = req.user.id;
 const statusFilter = req.query.status;
 const page = parseInt(req.query.page) || 1;
 const limit = parseInt(req.query.limit) || 10;
 const skip = (page - 1) * limit;
 const shop = await Shop.findOne({ userId });
 if (!shop) {
 return res.status(404).json({
 success: false,
 message: 'Shop not found',
 data: null
 });
 }
 let query = { shopId: shop._id };
 if (statusFilter) {
 query.status = statusFilter;
 }
 const total = await Order.countDocuments(query);
 const orders = await Order.find(query)
 .sort({ createdAt: -1 })
 .skip(skip)
 .limit(limit);
 res.json({
 success: true,
 message: 'Vendor orders retrieved',
 data: {
 items: orders,
 page,
 limit,
 total,
 pages: Math.ceil(total / limit)
 }
 });
 } catch (error) {
 res.status(500).json({
 success: false,
 message: 'Error retrieving vendor orders',
 data: null
 });
 }
};