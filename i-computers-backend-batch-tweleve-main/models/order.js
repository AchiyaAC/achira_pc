import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    image: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      default: "",
    },

    lastName: {
      type: String,
      trim: true,
      default: "",
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    addressLine1: {
      type: String,
      trim: true,
      default: "",
    },

    addressLine2: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      trim: true,
      default: "",
    },

    postalCode: {
      type: String,
      trim: true,
      default: "",
    },

    country: {
      type: String,
      trim: true,
      default: "Sri Lanka",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    secondaryPhone: {
      type: String,
      trim: true,
      default: "",
    },

    customerNotes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "Order must contain at least one item",
      },
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    shippingAddress: {
      type: shippingAddressSchema,
      default: {},
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    customerNotes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.date = ret.createdAt;

    // Compatibility fields
    if (ret.shippingAddress) {
      ret.firstName = ret.shippingAddress.firstName || "";
      ret.lastName = ret.shippingAddress.lastName || "";
      ret.address = ret.shippingAddress.address || ret.shippingAddress.addressLine1 || "";
      ret.city = ret.shippingAddress.city || "";
      ret.phone = ret.shippingAddress.phone || "";
    }

    delete ret.__v;

    return ret;
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;