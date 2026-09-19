import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/api";
import { getImageUrl } from "../lib/imageUrl";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      setLoading(true);

      // IMPORTANT:
      // Customer orders endpoint is /orders/my
      // NOT /orders
      const response = await api.get("/orders/my");

      console.log("My Orders API response:", response.data);

      const data =
        response.data?.orders ||
        response.data?.data ||
        response.data;

      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("My Orders Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load your orders."
      );

      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusClass = (status) => {
    switch (String(status || "").toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700";

      case "shipped":
        return "bg-blue-100 text-blue-700";

      case "processing":
        return "bg-purple-100 text-purple-700";

      case "confirmed":
        return "bg-cyan-100 text-cyan-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-LK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>

            <p className="mt-4 text-sm font-semibold text-slate-500">
              Loading your orders...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* PAGE HEADER */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Account
              </p>

              <h1 className="mt-1 text-3xl font-black text-slate-900">
                My Orders
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                View and track all your orders.
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex w-fit rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {orders.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-4xl">
              🛒
            </div>

            <h2 className="mt-6 text-2xl font-black text-slate-900">
              No Orders Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              You haven't placed any orders yet.
              Start shopping and your orders will
              appear here.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order, index) => {
              const items = Array.isArray(order.items)
                ? order.items
                : [];

              const total = Number(
                order.totalAmount ||
                  order.total ||
                  0
              );

              const status =
                order.status || "Pending";

              return (
                <div
                  key={
                    order._id ||
                    order.orderId ||
                    index
                  }
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  {/* ORDER TOP */}
                  <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Order ID
                      </p>

                      <p className="mt-1 text-sm font-black text-slate-900">
                        #
                        {order.orderId ||
                          order._id ||
                          "N/A"}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {formatDate(
                          order.createdAt
                        )}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-4 py-2 text-xs font-bold ${getStatusClass(
                        status
                      )}`}
                    >
                      {status}
                    </span>
                  </div>

                  {/* ORDER ITEMS */}
                  <div className="p-5">
                    <h3 className="mb-4 text-sm font-bold text-slate-900">
                      Order Items
                    </h3>

                    {items.length > 0 ? (
                      <div className="space-y-3">
                        {items.map(
                          (item, itemIndex) => {
                            const image = getImageUrl(
                              item.image
                            );

                            return (
                              <div
                                key={
                                  item._id ||
                                  itemIndex
                                }
                                className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-3"
                              >
                                {/* IMAGE */}
                                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
                                  {image ? (
                                    <img
                                      src={image}
                                      alt={
                                        item.name ||
                                        "Product"
                                      }
                                      className="h-full w-full object-cover"
                                      onError={(
                                        event
                                      ) => {
                                        event.currentTarget.style.display =
                                          "none";
                                      }}
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center text-xl">
                                      📦
                                    </div>
                                  )}
                                </div>

                                {/* DETAILS */}
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-bold text-slate-800">
                                    {item.name ||
                                      "Product"}
                                  </p>

                                  <p className="mt-1 text-xs text-slate-500">
                                    Quantity:{" "}
                                    {item.quantity ||
                                      1}
                                  </p>

                                  <p className="mt-1 text-xs text-slate-500">
                                    Unit Price: Rs.{" "}
                                    {Number(
                                      item.price ||
                                        0
                                    ).toLocaleString(
                                      "en-LK",
                                      {
                                        minimumFractionDigits: 2,
                                      }
                                    )}
                                  </p>
                                </div>

                                {/* ITEM TOTAL */}
                                <div className="text-right">
                                  <p className="text-sm font-black text-slate-900">
                                    Rs.{" "}
                                    {(
                                      Number(
                                        item.price ||
                                          0
                                      ) *
                                      Number(
                                        item.quantity ||
                                          1
                                      )
                                    ).toLocaleString(
                                      "en-LK",
                                      {
                                        minimumFractionDigits: 2,
                                      }
                                    )}
                                  </p>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">
                        No item details available.
                      </p>
                    )}
                  </div>

                  {/* ORDER FOOTER */}
                  <div className="flex flex-col gap-4 border-t border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        Total Amount
                      </p>

                      <p className="mt-1 text-2xl font-black text-slate-900">
                        Rs.{" "}
                        {total.toLocaleString(
                          "en-LK",
                          {
                            minimumFractionDigits: 2,
                          }
                        )}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={loadOrders}
                      className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      Refresh Orders
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}