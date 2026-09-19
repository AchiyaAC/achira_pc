import React from "react";

import { formatPrice } from "../lib/price-format";
import {
  formatTimestamp,
} from "../lib/date-format";

export default function OrderDetailsModal({
  order,
  onClose,
}) {
  if (!order) {
    return null;
  }

  const items = order.items || [];

  const shipping =
    order.shippingAddress || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Order Details
            </h2>

            <p className="text-sm text-gray-500">
              {order.orderId ||
                order._id ||
                "Order"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Order information */}
          <div className="grid gap-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-gray-400">
                Order Date
              </p>

              <p className="mt-1 text-sm font-medium">
                {formatTimestamp(
                  order.createdAt ||
                    order.date
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Status
              </p>

              <p className="mt-1 text-sm font-semibold text-blue-600">
                {order.status || "Pending"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Total
              </p>

              <p className="mt-1 text-sm font-bold text-gray-900">
                {formatPrice(
                  order.totalAmount
                )}
              </p>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="mb-3 font-semibold">
              Items
            </h3>

            <div className="divide-y rounded-xl border">
              {items.map((item, index) => (
                <div
                  key={
                    item.product ||
                    item.productId ||
                    index
                  }
                  className="flex items-center justify-between gap-4 p-4"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {item.name ||
                        "Product"}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Qty:{" "}
                      {item.quantity ||
                        item.qty ||
                        1}
                    </p>
                  </div>

                  <p className="text-sm font-semibold">
                    {formatPrice(
                      (Number(item.price) ||
                        0) *
                        (Number(
                          item.quantity ||
                            item.qty
                        ) || 1)
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping */}
          <div>
            <h3 className="mb-3 font-semibold">
              Shipping Address
            </h3>

            <div className="rounded-xl border bg-gray-50 p-4 text-sm text-gray-700">
              <p className="font-medium">
                {shipping.firstName ||
                  order.firstName ||
                  ""}{" "}
                {shipping.lastName ||
                  order.lastName ||
                  ""}
              </p>

              <p className="mt-2">
                {shipping.addressLine1 ||
                  shipping.address ||
                  order.address ||
                  ""}
              </p>

              {shipping.addressLine2 && (
                <p>
                  {shipping.addressLine2}
                </p>
              )}

              <p>
                {shipping.city ||
                  order.city ||
                  ""}
                {shipping.postalCode
                  ? `, ${shipping.postalCode}`
                  : ""}
              </p>

              <p>
                {shipping.country ||
                  "Sri Lanka"}
              </p>

              <p className="mt-2">
                Phone:{" "}
                {shipping.phone ||
                  order.phone ||
                  "N/A"}
              </p>
            </div>
          </div>

          {/* Notes */}
          {(
            order.customerNotes ||
            shipping.customerNotes
          ) && (
            <div>
              <h3 className="mb-2 font-semibold">
                Customer Notes
              </h3>

              <p className="rounded-xl bg-yellow-50 p-4 text-sm text-gray-700">
                {order.customerNotes ||
                  shipping.customerNotes}
              </p>
            </div>
          )}
        </div>

        <div className="border-t p-4">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}