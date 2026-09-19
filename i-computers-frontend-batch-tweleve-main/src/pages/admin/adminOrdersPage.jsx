import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../lib/api";
import { formatPrice } from "../../lib/price-format";
import { formatTimestamp } from "../../lib/date-format";
import AdminOrderDetailsModal from "../../components/adminOrderDetailsModal";

const statusOptions = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await api.get("/orders");

      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : data.orders || [];

      setOrders(list);
    } catch (error) {
      console.error("Fetch orders error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders =
    statusFilter === "All"
      ? orders
      : orders.filter(
          (order) =>
            order.status === statusFilter
        );

  const handleStatusUpdated = (updatedOrder) => {
    if (!updatedOrder) {
      return;
    }

    const updatedId =
      updatedOrder._id ||
      updatedOrder.orderId;

    setOrders((previous) =>
      previous.map((order) => {
        const orderId =
          order._id ||
          order.orderId;

        return orderId === updatedId
          ? updatedOrder
          : order;
      })
    );

    setSelectedOrder(updatedOrder);
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <h2>Loading orders...</h2>
      </div>
    );
  }

  return (
    <div className="admin-orders-page">
      <div className="admin-page-header">
        <div>
          <h1>Orders</h1>
          <p>
            Manage customer orders and order status.
          </p>
        </div>
      </div>

      <div className="admin-toolbar">
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="All">
            All Orders
          </option>

          {statusOptions.map((status) => (
            <option
              key={status}
              value={status}
            >
              {status}
            </option>
          ))}
        </select>

        <span>
          {filteredOrders.length} order
          {filteredOrders.length !== 1
            ? "s"
            : ""}
        </span>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="admin-empty-state">
          <h2>No orders found</h2>

          <p>
            There are no orders matching the
            selected filter.
          </p>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => {
                const id =
                  order._id ||
                  order.orderId;

                const shipping =
                  order.shippingAddress || {};

                const customerName =
                  order.user?.name ||
                  `${shipping.firstName || ""} ${
                    shipping.lastName || ""
                  }`.trim() ||
                  order.firstName ||
                  "Customer";

                const itemCount =
                  order.items?.reduce(
                    (total, item) =>
                      total +
                      Number(
                        item.quantity || 0
                      ),
                    0
                  ) || 0;

                return (
                  <tr key={id}>
                    <td>
                      <strong>
                        {order.orderId || id}
                      </strong>
                    </td>

                    <td>
                      {customerName}
                    </td>

                    <td>
                      {formatTimestamp(
                        order.createdAt ||
                          order.date
                      )}
                    </td>

                    <td>
                      {itemCount}
                    </td>

                    <td>
                      {formatPrice(
                        order.totalAmount
                      )}
                    </td>

                    <td>
                      <span
                        className={`order-status status-${String(
                          order.status ||
                            "Pending"
                        )
                          .toLowerCase()
                          .replace(
                            /\s+/g,
                            "-"
                          )}`}
                      >
                        {order.status ||
                          "Pending"}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="view-button"
                        onClick={() =>
                          setSelectedOrder(
                            order
                          )
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <AdminOrderDetailsModal
          order={selectedOrder}
          onClose={() =>
            setSelectedOrder(null)
          }
          onStatusUpdated={
            handleStatusUpdated
          }
        />
      )}
    </div>
  );
}

export default AdminOrdersPage;