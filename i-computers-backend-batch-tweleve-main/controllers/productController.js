import mongoose from "mongoose";
import Product from "../models/product.js";
import { randomUUID } from "crypto";
import { uploadImageToCloudinary } from "../middleware/cloudinary.js";

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const category = String(req.body.category || "").trim();
    const description = String(req.body.description || "").trim();

    const price = Number(req.body.price);
    const quantity = Number(req.body.quantity);

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Product name and category are required.",
      });
    }

    if (!Number.isFinite(price) || price < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product price.",
      });
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a valid whole number.",
      });
    }

    let image = "";

    if (req.file) {
      const uploaded = await uploadImageToCloudinary(req.file);
      image = uploaded.url;
    }

    const product = await Product.create({
      productId: randomUUID(),
      name,
      category,
      price,
      quantity,
      description,
      image,
      images: image ? [image] : [],
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create product.",
    });
  }
};

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    return res.json(products);
  } catch (error) {
    console.error("Get products error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load products.",
    });
  }
};

// GET SINGLE PRODUCT
export const getProductById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.json(product);
  } catch (error) {
    console.error("Get product error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load product.",
    });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    if (req.body.name !== undefined) {
      product.name = String(req.body.name).trim();
    }

    if (req.body.category !== undefined) {
      product.category = String(req.body.category).trim();
    }

    if (req.body.description !== undefined) {
      product.description = String(req.body.description).trim();
    }

    if (req.body.price !== undefined) {
      const price = Number(req.body.price);

      if (!Number.isFinite(price) || price < 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid product price.",
        });
      }

      product.price = price;
    }

    if (req.body.quantity !== undefined) {
      const quantity = Number(req.body.quantity);

      if (!Number.isInteger(quantity) || quantity < 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid product quantity.",
        });
      }

      product.quantity = quantity;
    }

    if (req.file) {
      const uploaded = await uploadImageToCloudinary(req.file);
      product.image = uploaded.url;
      product.images = [uploaded.url];
    }

    await product.save();

    return res.json({
      success: true,
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update product.",
    });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete product.",
    });
  }
};
