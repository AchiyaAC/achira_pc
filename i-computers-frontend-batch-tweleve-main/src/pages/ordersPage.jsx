import React, {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../lib/api";
import Header from "../components/header";
import LoadingAnimation from "../components/loadingAnimation";
import OrderDetailsModal from "../components/orderDetailsModal";

import {
  formatPrice,
} from "../lib/price-format";

import {
  formatTimestamp,
} from "../lib/date-format";

export default function OrdersPage() {
  const [orders, setOrders] =
    useState([]);

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response =
          await api.get("/orders/my");

        const data = Array.isArray(
          response.data
        )
          ? response.data
          : response.data?.orders || [];

        setOrders(data);
      } catch (error) {
        console.error(error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load orders."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {isLoading && <LoadingAnimation />}

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Orders
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Your order history.
          </p>
        </div>

        {!isLoading &&
        orders.length === 0 ? (
          <div className="rounded-2xl border bg-white p-12 text-center">
            <div className="text-5xl">📦</div>

            <h2 className="mt-4 text-xl font-bold">
              No orders found
            </h2>

            <Link
              to="/products"
              className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="hidden grid-cols-5 gap-4 border-b bg-gray-50 px-5 py-4 text-xs font-semibold uppercase text-gray-500 md:grid">
              <span>Order</span>
              <span>Date</span>
              <span>Status</span>
              <span>Total</span>
              <span className="text-right">
                Action
              </span>
            </div>

            {orders.map((order) => (
              <div
                key={
                  order._id ||
                  order.orderId
                }
                className="grid gap-3 border-b px-5 py-5 last:border-0 md:grid-cols-5 md:items-center"
              >
                <div>
                  <p className="text-xs text-gray-400 md:hidden">
                    Order
                  </p>

                  <p className="font-semibold">
                    {order.orderId ||
                      order._id}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 md:hidden">
                    Date
                  </p>

                  <p className="text-sm text-gray-600">
                    {formatTimestamp(
                      order.createdAt ||
                        order.date
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 md:hidden">
                    Status
                  </p>

                  <p className="text-sm font-semibold text-blue-600">
                    {order.status ||
                      "Pending"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 md:hidden">
                    Total
                  </p>

                  <p className="font-bold">
                    {formatPrice(
                      order.totalAmount
                    )}
                  </p>
                </div>

                <div className="md:text-right">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedOrder(
                        order
                      )
                    }
                    className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <OrderDetailsModal
        order={selectedOrder}
        onClose={() =>
          setSelectedOrder(null)
        }
      />
    </div>
  );
}