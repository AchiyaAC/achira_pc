import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../lib/api";
import {
  getCart,
  getCartTotal,
} from "../lib/cart";
import { formatPrice } from "../lib/price-format";

export default function OrderModal({
  isOpen,
  onClose,
}) {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    country: "Sri Lanka",
    phone: "",
    secondaryPhone: "",
    customerNotes: "",
  });

  if (!isOpen) {
    return null;
  }

  const cart = getCart();
  const total = getCartTotal();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);

    try {
      const items = cart.map((item) => ({
        productId:
          item.productId ||
          item._id ||
          item.id,

        quantity:
          Number(item.quantity) || 1,
      }));

      await api.post("/orders", {
        items,

        shippingAddress: {
          firstName: form.firstName,
          lastName: form.lastName,
          address:
            form.address ||
            form.addressLine1,
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
          phone: form.phone,
          secondaryPhone:
            form.secondaryPhone,
          customerNotes:
            form.customerNotes,
        },

        customerNotes:
          form.customerNotes,
      });

      localStorage.removeItem("cart");

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      toast.success(
        "Order placed successfully!"
      );

      onClose?.();

      navigate("/my-orders");
    } catch (error) {
      console.error(
        "Order creation error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to place order."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Place Order
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Total: {formatPrice(total)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
              className="rounded-lg border p-3 outline-none focus:border-blue-500"
            />

            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
              className="rounded-lg border p-3 outline-none focus:border-blue-500"
            />
          </div>

          <input
            name="addressLine1"
            value={form.addressLine1}
            onChange={handleChange}
            placeholder="Address Line 1"
            required
            className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
          />

          <input
            name="addressLine2"
            value={form.addressLine2}
            onChange={handleChange}
            placeholder="Address Line 2 (Optional)"
            className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              required
              className="rounded-lg border p-3 outline-none focus:border-blue-500"
            />

            <input
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              placeholder="Postal Code"
              required
              className="rounded-lg border p-3 outline-none focus:border-blue-500"
            />
          </div>

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
          />

          <input
            name="secondaryPhone"
            value={form.secondaryPhone}
            onChange={handleChange}
            placeholder="Secondary Phone (Optional)"
            className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
          />

          <textarea
            name="customerNotes"
            value={form.customerNotes}
            onChange={handleChange}
            placeholder="Order notes (Optional)"
            rows={3}
            className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
          />

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 rounded-lg border px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSubmitting
                ? "Placing..."
                : "Place Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}