import express from "express";

import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";

import {
  authenticate,
  requireAdmin,
} from "../middleware/authenticate.js";

const router = express.Router();

// Customer
router.post("/", authenticate, createOrder);

router.get(
  "/my",
  authenticate,
  getMyOrders
);

// Admin
router.get(
  "/",
  authenticate,
  requireAdmin,
  getAllOrders
);

// Single order
router.get(
  "/:id",
  authenticate,
  getOrderById
);

// Admin status update
router.put(
  "/:id/status",
  authenticate,
  requireAdmin,
  updateOrderStatus
);

// Compatibility with your old frontend:
// PUT /orders/:orderId/:status
router.put(
  "/:id/:status",
  authenticate,
  requireAdmin,
  (req, res, next) => {
    req.body.status = req.params.status;
    next();
  },
  updateOrderStatus
);

export default router;