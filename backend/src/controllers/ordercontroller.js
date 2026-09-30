

const Cart = require('../models/cart');
const Order = require('../models/order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/product');
const Shop = require('../models/Shop'); // Capital S

const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });

    // If cart doesn't exist, create empty cart
    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: 'Cart retrieved',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    // Validate request
    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity required',
        data: null
      });
    }

    if (quantity < 1 || !Number.isInteger(quantity)) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a positive integer',
        data: null
      });
    }

    // Get product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        data: null
      });
    }

    // Check product is active
    if (!product.isActive) {
      return res.status(400).json({
        success: false,
        message: `${product.name} is no longer available`,
        data: null
      });
    }

    // Check vendor exists and is active
    const vendor = await Shop.findById(product.vendor);
    if (!vendor) {
      return res.status(400).json({
        success: false,
        message: `Vendor for ${product.name} not found`,
        data: null
      });
    }

    if (!vendor.isActive) {
      return res.status(400).json({
        success: false,
        message: `${vendor.name} is no longer active`,
        data: null
      });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Only ${product.stock} available`,
        data: null
      });
    }

    // Get or create cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if item already in cart
    const existingItem = cart.items.find(
      item => item.productId.toString() === productId
    );

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;

      // Verify stock for updated quantity
      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock. Only ${product.stock} available`,
          data: null
        });
      }

      existingItem.quantity = newQuantity;
    } else {
      // Add new item to cart with current product price
      cart.items.push({
        productId,
        quantity,
        price: product.price // Store price at time of adding
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    // Validate
    if (!quantity || quantity < 1 || !Number.isInteger(quantity)) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a positive integer',
        data: null
      });
    }

    // Get cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
        data: null
      });
    }

    // Find item in cart
    const cartItem = cart.items.find(item => item._id.toString() === itemId);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
        data: null
      });
    }

    // Get product and check stock
    const product = await Product.findById(cartItem.productId);
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Only ${product.stock} available`,
        data: null
      });
    }

    // Update quantity
    cartItem.quantity = quantity;
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

/**
 * Remove Item from Cart
 * DELETE /api/v1/cart/items/:itemId
 */
const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;

    // Get cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
        data: null
      });
    }

    // Remove item
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

/**
 * Clear Entire Cart
 * DELETE /api/v1/cart
 */
const clearCart = async (req, res) => {
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

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};


const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod } = req.body;

    // ========== STEP 1: VALIDATE REQUEST ==========
    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address and payment method required',
        data: null
      });
    }

    // Validate shipping address has all fields
    const { address, city, state, zipCode } = shippingAddress;
    if (!address || !city || !state || !zipCode) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address required',
        data: null
      });
    }

    // Validate payment method
    const validMethods = ['credit_card', 'bank_transfer', 'cash_on_delivery'];
    if (!validMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method',
        data: null
      });
    }

    // ========== STEP 2: GET AND VALIDATE CART ==========
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
        data: null
      });
    }

    const validatedItems = [];
    const itemsByVendor = {}; // Group by vendor later

    for (const cartItem of cart.items) {
      // Get product
      const product = await Product.findById(cartItem.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product not found`,
          data: null
        });
      }

      // Check product is active
      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is no longer available`,
          data: null
        });
      }

      // Get vendor
      const vendor = await Shop.findById(product.vendor);
      if (!vendor) {
        return res.status(400).json({
          success: false,
          message: `Vendor for ${product.name} not found`,
          data: null
        });
      }

      // Check vendor is active
      if (!vendor.isActive) {
        return res.status(400).json({
          success: false,
          message: `${vendor.name} is no longer active`,
          data: null
        });
      }

      // Check stock
      if (product.stock < cartItem.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} only has ${product.stock} available`,
          data: null
        });
      }

      // All validations passed for this item
      validatedItems.push({
        cartItem,
        product,
        vendor
      });
    }

    for (const item of validatedItems) {
      const vendorId = item.vendor._id.toString();

      if (!itemsByVendor[vendorId]) {
        itemsByVendor[vendorId] = {
          vendor: item.vendor,
          items: []
        };
      }

      itemsByVendor[vendorId].items.push(item);
    }

    const createdOrders = [];
    const stockUpdates = []; // Track all stock updates

    for (const [vendorId, vendorData] of Object.entries(itemsByVendor)) {
      // Calculate total amount for this vendor's order
      const totalAmount = vendorData.items.reduce(
        (sum, item) => sum + (item.cartItem.price * item.cartItem.quantity),
        0
      );

      // Create order
      const order = new Order({
        customerId: userId,
        shopId: vendorId,
        status: 'pending',
        totalAmount,
        shippingAddress,
        paymentMethod,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await order.save();

      // Create order items for this vendor
      for (const item of vendorData.items) {
        const orderItem = new OrderItem({
          orderId: order._id,
          productId: item.cartItem.productId,
          quantity: item.cartItem.quantity,
          priceAtPurchase: item.cartItem.price
        });

        await orderItem.save();

        // Track stock update
        stockUpdates.push({
          productId: item.product._id,
          quantity: item.cartItem.quantity
        });
      }

      createdOrders.push({
        orderId: order._id,
        vendorName: item.vendor.name,
        totalAmount,
        itemCount: vendorData.items.length
      });
    }

    for (const update of stockUpdates) {
      await Product.findByIdAndUpdate(
        update.productId,
        { $inc: { stock: -update.quantity } },
        { new: true }
      );
    }

    await Cart.deleteOne({ userId });

    res.status(201).json({
      success: true,
      message: `${createdOrders.length} order(s) created successfully`,
      data: {
        orders: createdOrders,
        totalOrders: createdOrders.length,
        summary: `Your checkout was split into ${createdOrders.length} order(s), one per vendor`
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

const getOrders = async (req, res) => {
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

    const pages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      message: 'Orders retrieved',
      data: {
        items: orders,
        page,
        limit,
        total,
        pages
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    // Get order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
        data: null
      });
    }

    // Security check: user can only view own orders
    if (order.customerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own orders',
        data: null
      });
    }

    // Get order items with product details
    const orderItems = await OrderItem.find({ orderId }).populate({
      path: 'productId',
      select: 'name image price'
    });

    // Combine order + items
    const orderWithItems = {
      ...order.toObject(),
      items: orderItems
    };

    res.status(200).json({
      success: true,
      message: 'Order retrieved',
      data: orderWithItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};


const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
        data: null
      });
    }

    // Get order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
        data: null
      });
    }

    // Get vendor's shop
    const shop = await Shop.findOne({ owner: userId });
    if (!shop) {
      return res.status(400).json({
        success: false,
        message: 'Shop not found',
        data: null
      });
    }

    // Security check: vendor can only update own orders
    if (order.shopId.toString() !== shop._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update orders from your shop',
        data: null
      });
    }

    // Update status
    order.status = status;
    order.updatedAt = new Date();
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};
const getVendorOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get vendor's shop
    const shop = await Shop.findOne({ owner: userId });
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found',
        data: null
      });
    }

    // Build filter
    const filter = { shopId: shop._id };
    if (status) {
      filter.status = status;
    }

    // Get total count
    const total = await Order.countDocuments(filter);

    // Get orders
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const pages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      message: 'Vendor orders retrieved',
      data: {
        items: orders,
        page,
        limit,
        total,
        pages
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

module.exports = {
  // Cart
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  // Orders
  createOrder,
  getOrders,
  getOrderDetails,
  updateOrderStatus,
  getVendorOrders
};