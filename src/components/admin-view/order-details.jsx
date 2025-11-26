import React, { useState } from "react";
import CommonForm from "../common/form";
import { useDispatch, useSelector } from "react-redux";
import { GetAllOrdersForAdmin, getOrderDetailsForAdmin, updateOrderStatus } from "../../../server/admin-order";

const AdminOrderDetailsView = ({ order, setSelectedOrder }) => {

  const dispatch = useDispatch();

  if (!order) return <p className="text-gray-600">No order details available.</p>;

  const [formData, setFormData] = useState({
    status: order.orderStatus || "",
  });

  const handleUpdateStatus = () => {
    console.log("Updated status to:", formData.status);
    dispatch(updateOrderStatus({ id: order?._id, orderStatus: formData.status }))
      .then((data) => {
        console.log("data = ", data);
        if (data?.payload?.success) {
          dispatch(getOrderDetailsForAdmin(order?._id))
          dispatch(GetAllOrdersForAdmin())
          setFormData(data?.payload?.orderStatus)
          setSelectedOrder(null)
        }
      })
  };

  const {
    _id,
    orderData,
    orderStatus,
    paymentMethod,
    paymentStatus,
    totalAmount,
    addressInfo,
    cartItems,
  } = order;

  return (
    <div className="pt-8 space-y-6">
      {/* ✅ Order Info */}
      <div className="flex flex-col gap-2 border-b pb-4">
        <div className="flex justify-between">
          <p>Order ID</p>
          <span className="font-medium">#{_id}</span>
        </div>
        <div className="flex justify-between">
          <p>Order Date</p>
          <span>
            {new Date(orderData).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>
        </div>
        <div className="flex justify-between">
          <p>Order Status</p>
          <span>{orderStatus}</span>
        </div>
        <div className="flex justify-between">
          <p>Payment Method</p>
          <span>{paymentMethod}</span>
        </div>
        <div className="flex justify-between">
          <p>Payment Status</p>
          <span>{paymentStatus}</span>
        </div>
        <div className="flex justify-between">
          <p>Total Price</p>
          <span className="font-bold text-gray-800">₹{totalAmount}</span>
        </div>
      </div>

      {/* ✅ Order Items */}
      <div>
        <h3 className="font-semibold text-lg mb-2">Order Items</h3>
        {cartItems && cartItems.length > 0 ? (
          <div className="divide-y border rounded-lg bg-gray-50">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center py-3 px-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-12 rounded-lg object-cover border"
                  />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm line-through text-gray-400">
                    ₹{item.price}
                  </p>
                  <p className="font-semibold text-gray-800">
                    ₹{item.salePrice}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600">No items in this order.</p>
        )}
      </div>

      {/* ✅ Shipping Information */}
      {addressInfo && (
        <div>
          <h3 className="font-semibold text-lg mb-2">Shipping Information</h3>
          <div className="flex flex-col gap-1 text-sm text-gray-700 border rounded-lg p-4 bg-gray-50">
            <span>
              <strong>Address:</strong> {addressInfo.address}
            </span>
            <span>
              <strong>City:</strong> {addressInfo.city}
            </span>
            <span>
              <strong>Pincode:</strong> {addressInfo.pincode}
            </span>
            <span>
              <strong>Phone:</strong> {addressInfo.phone}
            </span>
            {addressInfo.notes && (
              <span>
                <strong>Notes:</strong> {addressInfo.notes}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ✅ Update Order Status */}
      <div className="border-t pt-4">
        <CommonForm
          formControls={[
            {
              label: "Order Status",
              name: "status",
              componentType: "select",
              options: [
                { id: "Pending", label: "Pending" },
                { id: "In Process", label: "In Process" },
                { id: "In Shipping", label: "In Shipping" },
                { id: "Rejected", label: "Rejected" },
                { id: "Delivered", label: "Delivered" },
              ],
            },
          ]}
          formData={formData}
          setFormData={setFormData}
          buttonText="Update Order Status"
          onSubmit={handleUpdateStatus}
        />
      </div>
    </div>
  );
};

export default AdminOrderDetailsView;

