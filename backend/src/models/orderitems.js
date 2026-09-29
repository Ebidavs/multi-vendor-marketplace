const mongoose = require('mongoose');
const OrderItemsSchema = new mongoose.Schema(
 {
 // Which order does this item belong to?
 orderId: {
 type: mongoose.Schema.Types.ObjectId,
 ref: 'Order',
 required: true
 },
 // Which product is this?
 productId: {
 type: mongoose.Schema.Types.ObjectId,
 ref: 'Product',
 required: true
 },
 // How many of this product?
 quantity: {
 type: Number,
 required: true,
 min: 1
 },
 // What was the price at time of purchase?
 // Important: we store this because product price might change 
later
,priceAtPurchase: {
 type: Number,
 required: true,
 min: 0
 }
 }
);
module.exports = mongoose.model('OrderItems', OrderItemsSchema);