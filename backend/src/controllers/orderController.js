const mongoose = require('mongoose');
const Cart = require('../models/cart');
const Order = require('../models/order');
const OrderItem = require('../models/orderItems');
const Product = require('../models/product');
const Shop = require('../models/shop');
const userModel = require('../models/user');

const User = userModel.User || userModel;

const getAvailableProduct = async (productId, session) => {
  let productQuery = Product.findOne({ _id: productId, isActive: true });
  if (session) productQuery = productQuery.session(session);
  const product = await productQuery;
  if (!product) return null;

  let vendorQuery = User.findOne({
    _id: product.vendor,
    role: 'vendor',
    isActive: true,
    deletedAt: null,
  });
  if (session) vendorQuery = vendorQuery.session(session);
  const vendor = await vendorQuery;
  if (!vendor) return null;

  let shopQuery = Shop.findOne({ owner: vendor._id, isActive: true });
  if (session) shopQuery = shopQuery.session(session);
  const shop = await shopQuery;
  if (!shop) return null;

  return { product, vendor, shop };
};

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
    const availableProduct = await getAvailableProduct(productId);
    if (!availableProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unavailable',
        data: null
      });
    }
    const { product } = availableProduct;

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
    const availableProduct = await getAvailableProduct(cartItem.productId);
    if (!availableProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unavailable',
        data: null
      });
    }
    const { product } = availableProduct;
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

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    if (cart.items.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
        data: null
      });
    }

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
  let session;
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

    const { fullName, phone, street, city, state, country } = shippingAddress;
    if (!fullName || !phone || !street || !city || !state) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address required',
        data: null
      });
    }
    const shippingAddressSnapshot = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      country: country?.trim() || 'Nigeria',
    };

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
    session = await mongoose.startSession();
    const createdOrders = [];

    await session.withTransaction(async () => {
      createdOrders.length = 0;
      const cart = await Cart.findOne({ userId }).session(session);
      if (!cart || cart.items.length === 0) {
        const error = new Error('Cart is empty');
        error.statusCode = 400;
        throw error;
      }

      const itemsByShop = new Map();
      for (const cartItem of cart.items) {
        const availableProduct = await getAvailableProduct(cartItem.productId, session);
        if (!availableProduct) {
          const error = new Error('A cart product or its vendor is no longer available');
          error.statusCode = 409;
          throw error;
        }

        const { product, vendor, shop } = availableProduct;
        const stockUpdate = await Product.updateOne(
          { _id: product._id, isActive: true, stock: { $gte: cartItem.quantity } },
          { $inc: { stock: -cartItem.quantity } },
          { session }
        );
        if (stockUpdate.modifiedCount !== 1) {
          const error = new Error(`${product.name} no longer has enough stock`);
          error.statusCode = 409;
          throw error;
        }

        const shopId = shop._id.toString();
        if (!itemsByShop.has(shopId)) {
          itemsByShop.set(shopId, { shop, vendor, items: [] });
        }
        itemsByShop.get(shopId).items.push({ cartItem, product });
      }

      for (const { shop, vendor, items } of itemsByShop.values()) {
        const totalAmount = items.reduce(
          (sum, { product, cartItem }) => sum + product.price * cartItem.quantity,
          0
        );
        const order = new Order({
          customerId: userId,
          shopId: shop._id,
          status: 'pending',
          totalAmount,
          shippingAddress: shippingAddressSnapshot,
          paymentMethod,
        });
        await order.save({ session });

        for (const { product, cartItem } of items) {
          await new OrderItem({
            orderId: order._id,
            productId: product._id,
            quantity: cartItem.quantity,
            priceAtPurchase: product.price,
          }).save({ session });
        }

        createdOrders.push({
          orderId: order._id,
          vendorName: vendor.name,
          totalAmount,
          itemCount: items.length,
        });
      }

      await Cart.deleteOne({ userId }, { session });
    });

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
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      data: null
    });
  } finally {
    if (session) await session.endSession();
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
      select: 'name images'
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

    // Update status. The Order schema uses `timestamps: true`, so Mongoose
    // maintains createdAt/updatedAt on save(); no manual timestamp is needed.
    order.status = status;
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