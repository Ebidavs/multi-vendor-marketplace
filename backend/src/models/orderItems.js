const mongoose = require('mongoose');
const OrderItemsSchema = new mongoose.Schema(
	{
		orderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Order',
			required: true,
		},
		productId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product',
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
			min: 1,
		},
		priceAtPurchase: {
			type: Number,
			required: true,
			min: 0,
		},
	}
);
module.exports = mongoose.model('OrderItems', OrderItemsSchema);