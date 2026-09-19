import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import Header from "../components/header";

import api from "../lib/api";

import {
  getCart,
  getCartTotal,
  clearCart,
} from "../lib/cart";

import {
  formatPrice,
} from "../lib/price-format";

export default function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    country: "Sri Lanka",
    phone: "",
    secondaryPhone: "",
    customerNotes: "",
  });

  useEffect(() => {
    const currentCart = getCart();

    if (currentCart.length === 0) {
      navigate("/cart");
      return;
    }

    setCart(currentCart);
  }, [navigate]);

  const total = getCartTotal();

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      navigate("/cart");
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

      const response = await api.post(
        "/orders",
        {
          items,

          shippingAddress: {
            firstName: form.firstName,
            lastName: form.lastName,

            address:
              form.addressLine1,

            addressLine1:
              form.addressLine1,

            addressLine2:
              form.addressLine2,

            city: form.city,

            postalCode:
              form.postalCode,

            country:
              form.country,

            phone: form.phone,

            secondaryPhone:
              form.secondaryPhone,

            customerNotes:
              form.customerNotes,
          },

          customerNotes:
            form.customerNotes,
        }
      );

      clearCart();

      toast.success(
        "Order placed successfully!"
      );

      const orderId =
        response.data?.order?.orderId ||
        response.data?.order?.id ||
        response.data?.order?._id;

      if (orderId) {
        navigate(
          `/orders?order=${orderId}`
        );
      } else {
        navigate("/my-orders");
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to place order."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <Link
            to="/cart"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            ← Back to Cart
          </Link>

          <h1 className="mt-3 text-3xl font-bold">
            Checkout
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[1fr_380px]"
        >
          {/* Shipping form */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">
              Shipping Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enter the details where you want your order delivered.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  First Name
                </label>

                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Last Name
                </label>

                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium">
                Address
              </label>

              <input
                name="addressLine1"
                value={form.addressLine1}
                onChange={handleChange}
                required
                placeholder="House number, street"
                className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
              />
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium">
                Address Line 2
              </label>

              <input
                name="addressLine2"
                value={form.addressLine2}
                onChange={handleChange}
                placeholder="Apartment, landmark, etc. (optional)"
                className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
              />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  City
                </label>

                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Postal Code
                </label>

                <input
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium">
                Country
              </label>

              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                required
                className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
              />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Phone Number
                </label>

                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  type="tel"
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Secondary Phone
                </label>

                <input
                  name="secondaryPhone"
                  value={form.secondaryPhone}
                  onChange={handleChange}
                  type="tel"
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium">
                Order Notes
              </label>

              <textarea
                name="customerNotes"
                value={form.customerNotes}
                onChange={handleChange}
                rows={4}
                placeholder="Any special instructions? (optional)"
                className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="h-fit rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              {cart.map((item) => {
                const quantity =
                  Number(item.quantity) || 1;

                return (
                  <div
                    key={
                      item.productId ||
                      item._id ||
                      item.id
                    }
                    className="flex justify-between gap-4 text-sm"
                  >
                    <div>
                      <p className="font-medium">
                        {item.name}
                      </p>

                      <p className="text-gray-500">
                        Qty: {quantity}
                      </p>
                    </div>

                    <p className="font-semibold">
                      {formatPrice(
                        (Number(item.price) ||
                          0) * quantity
                      )}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="my-6 border-t" />

            <div className="flex justify-between">
              <span className="font-semibold">
                Total
              </span>

              <span className="text-xl font-bold text-blue-600">
                {formatPrice(total)}
              </span>
            </div>

            <p className="mt-3 text-xs text-gray-400">
              The final total is calculated securely by the server.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSubmitting
                ? "Placing Order..."
                : "Place Order"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}