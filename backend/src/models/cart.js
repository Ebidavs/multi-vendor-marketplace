const mongoose = require('mongoose');
const CartSchema = new mongoose.Schema(
 {
 // Which user does this cart belong to?
 userId: {
 type: mongoose.Schema.Types.ObjectId,
 ref: 'User', // Reference to User model
 required: true,
 unique: true // Each user has ONE cart
 },
 // Array of items in the cart
 items: [
 {
 productId: {
 type: mongoose.Schema.Types.ObjectId,
 ref: 'Product', // Reference to Product model
 required: true
 },
 quantity: {
 type: Number,
 required: true,
 min: 1 // Must be at least 1
 },
 price: {
 type: Number, // Price when added to cart
 required: true,
 min: 0
 }
 }
 ]
 },
 {
 timestamps: true // Auto adds createdAt, updatedAt
 }
);
module.exports = mongoose.model('Cart', CartSchema);