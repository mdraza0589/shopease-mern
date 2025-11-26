import React, { useEffect, useState } from "react";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import { GetAllOrdersForAdmin } from "../../../server/admin-order";
import Loading from "../Loding/Loading";

const AdminOrdersView = () => {
    const [filter, setFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const dispatch = useDispatch();

    const { ordersList, isLoading, error } = useSelector(
        (state) => state.adminOrder
    );

    useEffect(() => {
        dispatch(GetAllOrdersForAdmin());
    }, [dispatch]);

    const orders = Array.isArray(ordersList) ? ordersList : [];

    const normalizeStatus = (status) =>
        status ? status.toLowerCase().trim() : "";

    // ✅ Counts
    const totalOrders = orders.length;
    const deliveredCount = orders.filter(
        (o) => normalizeStatus(o.orderStatus) === "delivered"
    ).length;
    const pendingCount = orders.filter(
        (o) => normalizeStatus(o.orderStatus) === "pending"
    ).length;
    const shippingCount = orders.filter(
        (o) =>
            normalizeStatus(o.orderStatus) === "inshipping" ||
            normalizeStatus(o.orderStatus) === "inprocess"
    ).length;
    const cancelledCount = orders.filter(
        (o) =>
            normalizeStatus(o.orderStatus) === "rejected" ||
            normalizeStatus(o.orderStatus) === "cancelled"
    ).length;

    const statusFilters = [
        { value: "all", label: "All Orders" },
        { value: "pending", label: "Pending" },
        { value: "inprocess", label: "In Process" },
        { value: "inshipping", label: "In Shipping" },
        { value: "delivered", label: "Delivered" },
        { value: "rejected", label: "Rejected" },
    ];

    const filteredOrders =
        filter === "all"
            ? orders
            : orders.filter(
                (order) =>
                    normalizeStatus(order.orderStatus) === normalizeStatus(filter)
            );

    const getStatusColor = (status) => {
        const s = normalizeStatus(status);
        const colors = {
            delivered: "bg-green-100 text-green-800 border-green-200",
            pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
            inshipping: "bg-blue-100 text-blue-800 border-blue-200",
            inprocess: "bg-indigo-100 text-indigo-800 border-indigo-200",
            rejected: "bg-red-100 text-red-800 border-red-200",
        };
        return colors[s] || "bg-gray-100 text-gray-800 border-gray-200";
    };

    const getStatusIcon = (status) => {
        const s = normalizeStatus(status);
        const icons = {
            delivered: "✅",
            pending: "⏳",
            inshipping: "🚚",
            inprocess: "⚙️",
            rejected: "❌",
        };
        return icons[s] || "📦";
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-600 text-lg">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        All Orders
                    </h1>
                    <p className="text-gray-600">Track and manage all user orders</p>
                </div>

                {/* ✅ Fixed Stats */}
                {/* ✅ Fixed Stats (Separated) */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    {/* Total */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="text-2xl font-bold text-gray-900">{totalOrders}</div>
                        <div className="text-sm text-gray-600">Total Orders</div>
                    </div>

                    {/* Delivered */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="text-2xl font-bold text-green-600">{deliveredCount}</div>
                        <div className="text-sm text-gray-600">Delivered</div>
                    </div>

                    {/* In Process */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="text-2xl font-bold text-indigo-600">
                            {
                                orders.filter((o) => normalizeStatus(o.orderStatus) === "inprocess")
                                    .length
                            }
                        </div>
                        <div className="text-sm text-gray-600">In Process</div>
                    </div>

                    {/* In Shipping */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="text-2xl font-bold text-blue-600">
                            {
                                orders.filter((o) => normalizeStatus(o.orderStatus) === "inshipping")
                                    .length
                            }
                        </div>
                        <div className="text-sm text-gray-600">In Shipping</div>
                    </div>

                    {/* Pending */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
                        <div className="text-sm text-gray-600">Pending</div>
                    </div>

                    {/* Rejected */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="text-2xl font-bold text-red-600">{cancelledCount}</div>
                        <div className="text-sm text-gray-600">Rejected</div>
                    </div>
                </div>


                {/* ✅ Filters */}
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

                {/* ✅ Orders List (same as before) */}
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden"
                        >
                            <div className="p-3">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                                    <div className="flex items-center space-x-4 mb-3 lg:mb-0">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <span className="text-blue-600 font-semibold">📦</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {order._id}
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
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                                order.orderStatus
                                            )}`}
                                        >
                                            {getStatusIcon(order.orderStatus)} {order.orderStatus}
                                        </span>
                                        <span className="text-lg font-bold text-gray-900">
                                            ₹{order.totalAmount || "—"}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredOrders.length === 0 && (
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

            {/* Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-[100%] p-4 md:w-[600px] h-[70vh] max-h-[85vh] rounded-2xl shadow-lg overflow-y-auto relative">
                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="absolute font-bold cursor-pointer top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl"
                        >
                            ✕
                        </button>
                        <AdminOrderDetailsView
                            order={selectedOrder}
                            setSelectedOrder={setSelectedOrder}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrdersView;
