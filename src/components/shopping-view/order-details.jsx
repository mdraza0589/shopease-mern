import React from 'react';

const ShoppingOrderDetails = ({ order }) => {
    if (!order) return <p>No order selected</p>;

    const {
        _id,
        orderData,
        orderStatus,
        totalAmount,
        cartItems = [],
        addressInfo = {},
    } = order;

    return (
        <div className="pt-6">
            {/* Order Info */}
            <div className="flex flex-col gap-2 border-b pb-4">
                <div className="flex justify-between">
                    <p className="text-gray-600">Order ID</p>
                    <span className="font-medium">#{_id}</span>
                </div>
                <div className="flex justify-between">
                    <p className="text-gray-600">Order Date</p>
                    <span>{new Date(orderData).toLocaleDateString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                    <p className="text-gray-600">Order Status</p>
                    <span className="font-semibold text-blue-600">{orderStatus}</span>
                </div>
                <div className="flex justify-between">
                    <p className="text-gray-600">Total Amount</p>
                    <span className="font-semibold text-green-600">₹{totalAmount}</span>
                </div>
            </div>

            {/* Products */}
            <div className="mt-6 border-b pb-4">
                <h2 className="font-bold text-lg mb-3">Ordered Products</h2>
                <div className="space-y-4">
                    {cartItems.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-16 h-16 object-cover rounded-md border"
                                />
                                <div>
                                    <p className="font-medium text-gray-900">{item.title}</p>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity || 1}</p>
                                </div>
                            </div>
                            <span className="font-semibold text-gray-800">₹{item.salePrice}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Shipping Info */}
            <div className="mt-6">
                <h2 className="font-bold text-lg mb-3">Shipping Information</h2>
                <div className="text-gray-700 space-y-1">
                    <p>{addressInfo.address}</p>
                    <p>{addressInfo.city}</p>
                    <p>Pincode: {addressInfo.pincode}</p>
                    <p>Phone: {addressInfo.phone}</p>
                    {addressInfo.notes && <p>Notes: {addressInfo.notes}</p>}
                </div>
            </div>
        </div>
    );
};

export default ShoppingOrderDetails;

