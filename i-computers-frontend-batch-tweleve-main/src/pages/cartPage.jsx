import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import Header from "../components/header";

import {
  getCart,
  removeFromCart,
  updateCartQuantity,
  getCartTotal,
} from "../lib/cart";

import {
  formatPrice,
} from "../lib/price-format";

export default function CartPage() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(getCart());

    const update = () => {
      setCart(getCart());
    };

    window.addEventListener(
      "cartUpdated",
      update
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        update
      );
    };
  }, []);

  const total = cart.reduce(
    (sum, item) =>
      sum +
      (Number(item.price) || 0) *
        (Number(item.quantity) || 0),
    0
  );

  const handleRemove = (productId) => {
    const updated =
      removeFromCart(productId);

    setCart(updated);
  };

  const handleQuantity = (
    productId,
    quantity
  ) => {
    const updated =
      updateCartQuantity(
        productId,
        quantity
      );

    setCart(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Shopping Cart
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Review your selected products.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="rounded-2xl border bg-white p-12 text-center">
            <div className="text-6xl">🛒</div>

            <h2 className="mt-5 text-2xl font-bold">
              Your cart is empty
            </h2>

            <p className="mt-2 text-gray-500">
              Add some products to your cart first.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
            {/* Items */}
            <div className="space-y-4">
              {cart.map((item) => {
                const productId =
                  item.productId ||
                  item._id ||
                  item.id;

                const quantity =
                  Number(item.quantity) || 1;

                const itemTotal =
                  (Number(item.price) || 0) *
                  quantity;

                return (
                  <div
                    key={productId}
                    className="flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                  >
                    {/* Image */}
                    <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl bg-gray-50 p-3">
                      <img
                        src={
                          item.images?.[0] ||
                          item.image ||
                          "https://via.placeholder.com/150"
                        }
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(event) => {
                          event.currentTarget.src =
                            "https://via.placeholder.com/150";
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h2 className="font-semibold text-gray-900">
                        {item.name}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {formatPrice(
                          item.price
                        )}{" "}
                        each
                      </p>

                      <p className="mt-2 font-bold text-blue-600">
                        {formatPrice(itemTotal)}
                      </p>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center overflow-hidden rounded-lg border">
                      <button
                        type="button"
                        onClick={() =>
                          handleQuantity(
                            productId,
                            quantity - 1
                          )
                        }
                        disabled={quantity <= 1}
                        className="px-3 py-2 hover:bg-gray-100 disabled:opacity-40"
                      >
                        −
                      </button>

                      <span className="min-w-10 border-x px-3 py-2 text-center">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleQuantity(
                            productId,
                            quantity + 1
                          )
                        }
                        className="px-3 py-2 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() =>
                        handleRemove(
                          productId
                        )
                      }
                      className="rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="h-fit rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">
                Order Summary
              </h2>

              <div className="mt-6 flex justify-between text-sm">
                <span className="text-gray-500">
                  Subtotal
                </span>

                <span className="font-semibold">
                  {formatPrice(total)}
                </span>
              </div>

              <div className="mt-3 flex justify-between text-sm">
                <span className="text-gray-500">
                  Delivery
                </span>

                <span className="font-semibold text-green-600">
                  Calculated at checkout
                </span>
              </div>

              <div className="my-5 border-t" />

              <div className="flex justify-between">
                <span className="font-bold">
                  Total
                </span>

                <span className="text-xl font-bold text-blue-600">
                  {formatPrice(total)}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/checkout")
                }
                className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="mt-3 block text-center text-sm font-medium text-gray-500 hover:text-blue-600"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}