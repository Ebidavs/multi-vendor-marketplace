const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema(
 {
 // Who made this order?
 customerId: {
 type: mongoose.Schema.Types.ObjectId,
 ref: 'User',
 required: true
 },
 // Which vendor's shop is this order for?
 shopId: {
 type: mongoose.Schema.Types.ObjectId,
 ref: 'Shop',
 required: true
 },
 // What's the status of this order?
 status: {
 type: String,
 enum: ['pending', 'processing', 'shipped', 'delivered'],
 default: 'pending'
 },
 // How much did customer pay?
 totalAmount: {
 type: Number,
 required: true,
 min: 0
 },
 // Where should we ship it?
 shippingAddress: {
 address: {
 type: String,
 required: true
 },
 city: {
 type: String,
 required: true
 },
 state: {
 type: String,
 required: true
 },
 zipCode: {
 type: String,
 required: true
 }
 },
 // How is customer paying?
 paymentMethod: {
 type: String,
 enum: ['credit_card', 'bank_transfer', 'cash_on_delivery'],
 required: true
 }
 },
 {
 timestamps: true
 }
);
module.exports = mongoose.model('Order', OrderSchema);