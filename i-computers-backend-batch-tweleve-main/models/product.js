import mongoose from "mongoose";
import { randomUUID } from "crypto";

const productSchema = new mongoose.Schema(
  {
   productId: {
  type: String,
  required: true,
  unique: true,
  default: () => randomUUID()
}, 
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 5000,
    },

    // Main image - kept for compatibility
    image: {
      type: String,
      default: "",
    },

    // Multiple images supported
    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

productSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.productId = ret._id.toString();

    if ((!ret.images || ret.images.length === 0) && ret.image) {
      ret.images = [ret.image];
    }

    if (!ret.images) {
      ret.images = [];
    }

    delete ret.__v;

    return ret;
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;