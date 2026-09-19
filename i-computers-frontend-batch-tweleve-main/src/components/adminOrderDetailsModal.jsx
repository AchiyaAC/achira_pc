import React from "react";

import { formatPrice } from "../lib/price-format";
import {
  formatTimestamp,
} from "../lib/date-format";

export default function AdminOrderDetailsModal({
  order,
  onClose,
  onStatusChange,
}) {
  if (!order) {
    return null;
  }

  const items = order.items || [];

  const shipping =
    order.shippingAddress || {};

  const statuses = [
    "Pending",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-bold">
              Order Management
            </h2>

            <p className="text-sm text-gray-500">
              {order.orderId ||
                order._id}
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
          {/* Summary */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-400">
                Date
              </p>

              <p className="mt-1 text-sm font-medium">
                {formatTimestamp(
                  order.createdAt ||
                    order.date
                )}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-400">
                Customer
              </p>

              <p className="mt-1 text-sm font-medium">
                {order.user?.name ||
                  order.user?.email ||
                  order.email ||
                  "Customer"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-400">
                Total
              </p>

              <p className="mt-1 text-sm font-bold">
                {formatPrice(
                  order.totalAmount
                )}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-400">
                Status
              </p>

              <select
                value={
                  order.status || "Pending"
                }
                onChange={(event) =>
                  onStatusChange?.(
                    event.target.value
                  )
                }
                className="mt-1 w-full rounded-lg border bg-white px-2 py-1 text-sm font-medium outline-none focus:border-blue-500"
              >
                {statuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="mb-3 font-semibold">
              Order Items
            </h3>

            <div className="overflow-hidden rounded-xl border">
              {items.map((item, index) => (
                <div
                  key={
                    item.product ||
                    item.productId ||
                    index
                  }
                  className="flex items-center justify-between border-b p-4 last:border-b-0"
                >
                  <div>
                    <p className="font-medium">
                      {item.name ||
                        "Product"}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Quantity:{" "}
                      {item.quantity ||
                        item.qty ||
                        1}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm">
                      Unit:{" "}
                      {formatPrice(
                        item.price
                      )}
                    </p>

                    <p className="font-semibold">
                      {formatPrice(
                        (Number(
                          item.price
                        ) || 0) *
                          (Number(
                            item.quantity ||
                              item.qty
                          ) || 1)
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer address */}
          <div>
            <h3 className="mb-3 font-semibold">
              Customer / Shipping Details
            </h3>

            <div className="rounded-xl border bg-gray-50 p-4 text-sm">
              <p className="font-semibold">
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

              {shipping.secondaryPhone && (
                <p>
                  Secondary:{" "}
                  {shipping.secondaryPhone}
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          {order.customerNotes && (
            <div>
              <h3 className="mb-2 font-semibold">
                Customer Notes
              </h3>

              <div className="rounded-xl bg-yellow-50 p-4 text-sm">
                {order.customerNotes}
              </div>
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