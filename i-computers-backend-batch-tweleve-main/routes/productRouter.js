import express from "express";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import {
  authenticate,
  requireAdmin,
} from "../middleware/authenticate.js";

import upload from "../middleware/upload.js";

const router = express.Router();

// Public
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin only
router.post(
  "/",
  authenticate,
  requireAdmin,
  upload.single("image"),
  createProduct
);

router.put(
  "/:id",
  authenticate,
  requireAdmin,
  upload.single("image"),
  updateProduct
);

router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  deleteProduct
);

export default router;