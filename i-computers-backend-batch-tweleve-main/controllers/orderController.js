import mongoose from "mongoose";
import Product from "../models/product.js";
import Order from "../models/order.js";

const allowedStatuses = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

function createOrderId() {
  const timestamp = Date.now();
  const random = Math.floor(1000 + Math.random() * 9000);

  return `ORD-${timestamp}-${random}`;
}

// CREATE ORDER — works with both local MongoDB and MongoDB Atlas
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Your cart is empty." });
    }

    const requested = new Map();
    for (const item of items) {
      const productId = item.productId || item.product || item._id;
      const quantity = Number(item.quantity ?? item.qty ?? 1);
      if (!mongoose.Types.ObjectId.isValid(productId) || !Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({ success: false, message: "Invalid product or quantity in cart." });
      }
      const key = productId.toString();
      requested.set(key, (requested.get(key) || 0) + quantity);
    }

    const ids = [...requested.keys()];
    const products = await Product.find({ _id: { $in: ids } });
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    for (const [id, quantity] of requested) {
      const product = productMap.get(id);
      if (!product) return res.status(400).json({ success: false, message: "One of the products no longer exists." });
      if (product.quantity < quantity) return res.status(400).json({ success: false, message: `${product.name} does not have enough stock. Available: ${product.quantity}` });
    }

    const orderItems = [];
    let totalAmount = 0;
    for (const item of items) {
      const id = (item.productId || item.product || item._id).toString();
      const quantity = Number(item.quantity ?? item.qty ?? 1);
      const product = productMap.get(id);
      const itemTotal = product.price * quantity;
      totalAmount += itemTotal;
      orderItems.push({ product: product._id, name: product.name, quantity, price: product.price, image: product.image || product.images?.[0] || "" });
    }

    // Atomic stock checks prevent two customers from buying the same last unit.
    for (const [id, quantity] of requested) {
      const updated = await Product.findOneAndUpdate(
        { _id: id, quantity: { $gte: quantity } },
        { $inc: { quantity: -quantity } },
        { new: true }
      );
      if (!updated) {
        // Restore any stock already changed in this request.
        for (const [doneId, doneQty] of requested) {
          if (doneId === id) break;
          await Product.findByIdAndUpdate(doneId, { $inc: { quantity: doneQty } });
        }
        return res.status(409).json({ success: false, message: "Stock changed while placing the order. Please try again." });
      }
    }

    try {
      const order = await Order.create({
        orderId: createOrderId(),
        user: req.user.id,
        items: orderItems,
        totalAmount,
        shippingAddress: shippingAddress || {},
        customerNotes: shippingAddress?.customerNotes || "",
        status: "Pending",
      });
      const createdOrder = await Order.findById(order._id).populate("user", "name email");
      return res.status(201).json({ success: true, message: "Order created successfully.", order: createdOrder });
    } catch (orderError) {
      for (const [id, quantity] of requested) await Product.findByIdAndUpdate(id, { $inc: { quantity } });
      throw orderError;
    }
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(400).json({ success: false, message: error.message || "Failed to create order." });
  }
};

// GET MY ORDERS
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to load your orders.",
    });
  }
};

// GET ALL ORDERS - ADMIN
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to load orders.",
    });
  }
};

// GET SINGLE ORDER
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      $or: [
        { orderId: id },
        ...(mongoose.Types.ObjectId.isValid(id)
          ? [{ _id: id }]
          : []),
      ],
    }).populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    const isOwner =
      order.user?._id?.toString() === req.user.id;

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view this order.",
      });
    }

    return res.json(order);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to load order.",
    });
  }
};

// UPDATE ORDER STATUS - ADMIN
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
      });
    }

    const order = await Order.findOne({
      $or: [
        { orderId: id },
        ...(mongoose.Types.ObjectId.isValid(id)
          ? [{ _id: id }]
          : []),
      ],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    order.status = status;

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate("user", "name email");

    return res.json({
      success: true,
      message: "Order status updated successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update order status.",
    });
  }
};