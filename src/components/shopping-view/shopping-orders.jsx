import React, { useEffect, useState } from "react";
import ShoppingOrderDetails from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../../../server/order";

const ShoppingOrders = () => {
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { ordersList, loading } = useSelector((state) => state.shopOrder);

  // ✅ Fetch user orders once on mount
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserOrders(user.id));
    }
  }, [dispatch, user?.id]);

  // ✅ Status filters
  const statusFilters = [
    { value: "all", label: "All Orders" },
    { value: "Pending", label: "Pending" },
    { value: "Shipped", label: "Shipped" },
    { value: "Delivered", label: "Delivered" },
    { value: "Cancelled", label: "Cancelled" },
  ];

  // ✅ Filter orders dynamically
  const filteredOrders =
    filter === "all"
      ? ordersList
      : ordersList.filter(
        (order) =>
          order.orderStatus?.toLowerCase() === filter.toLowerCase()
      );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            My Orders
          </h1>
          <p className="text-gray-600">Track and manage your purchases</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-gray-900">
              {ordersList?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-green-600">
              {ordersList.filter((o) => o.orderStatus === "Delivered").length}
            </div>
            <div className="text-sm text-gray-600">Delivered</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-blue-600">
              {ordersList.filter((o) => o.orderStatus === "Shipped").length}
            </div>
            <div className="text-sm text-gray-600">In Transit</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-yellow-600">
              {ordersList.filter((o) => o.orderStatus === "Pending").length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((status) => (
              <button
                key={status.value}
                onClick={() => setFilter(status.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === status.value
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loader */}
        {loading && (
          <div className="text-center py-12 text-gray-600 text-lg">
            Loading your orders...
          </div>
        )}

        {/* Orders List */}
        {!loading && filteredOrders?.length > 0 && (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Order ID: {order._id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.orderData).toLocaleDateString("en-IN", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${order.orderStatus === "Pending"
                          ? "text-yellow-600 border-yellow-300 bg-yellow-50"
                          : order.orderStatus === "Delivered"
                            ? "text-green-600 border-green-300 bg-green-50"
                            : order.orderStatus === "Shipped"
                              ? "text-blue-600 border-blue-300 bg-blue-50"
                              : order.orderStatus === "Cancelled"
                                ? "text-red-600 border-red-300 bg-red-50"
                                : "text-gray-600 border-gray-300 bg-gray-50"
                          }`}
                      >
                        {order.orderStatus}
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        ₹{order.totalAmount}
                      </span>
                    </div>
                  </div>

                  {/* Address Info */}
                  {order.addressInfo && (
                    <div className="text-sm text-gray-700 mb-4">
                      <p className="font-medium text-gray-900">
                        Delivery Address:
                      </p>
                      <p>{order.addressInfo.address}</p>
                      <p>
                        {order.addressInfo.city} - {order.addressInfo.pincode}
                      </p>
                      <p>📞 {order.addressInfo.phone}</p>
                    </div>
                  )}

                  {/* Items List */}
                  <div className="border-t border-gray-100 pt-4 mt-2">
                    <p className="font-medium text-gray-900 mb-3">Items:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {order.cartItems.map((item) => (
                        <div
                          key={item.productId}
                          className="flex items-center space-x-3 border border-gray-100 rounded-lg p-3"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-14 h-14 rounded-md object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              ₹{item.salePrice || item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="mt-4 text-sm text-gray-700 border-t border-gray-100 pt-4">
                    <p>
                      <span className="font-medium">Payment Method:</span>{" "}
                      {order.paymentMethod}
                    </p>
                    <p>
                      <span className="font-medium">Payment Status:</span>{" "}
                      {order.paymentStatus}
                    </p>
                    <p>
                      <span className="font-medium">Payment ID:</span>{" "}
                      {order.paymentId || "—"}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-3 mt-5">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                      View Details
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">
                      Track Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredOrders?.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">📦</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600 mb-6">
              No orders match your current filter selection.
            </p>
            <button
              onClick={() => setFilter("all")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              View All Orders
            </button>
          </div>
        )}
      </div>

      {/* 🧾 Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 w-full max-w-2xl rounded-xl shadow-lg overflow-y-auto max-h-[90vh] relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl font-bold"
            >
              ✕
            </button>
            <ShoppingOrderDetails order={selectedOrder} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingOrders;
