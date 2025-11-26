import React from "react";
import { MdDeleteOutline } from "react-icons/md";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCartItem,
  fetchCartItems,
  updateCartQuantity,
} from "../../../server/cart";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserCartContent = ({ cartItems }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { productList } = useSelector((state) => state.shopProducts);

  const handleCartItemDelete = (getItem) => {
    if (!user?.id) {
      toast.warn("⚠️ Please log in first!", { autoClose: 1500 });
      return;
    }

    dispatch(deleteCartItem({ userId: user?.id, productId: getItem?.productId }))
      .unwrap()
      .then(() => {
        dispatch(fetchCartItems(user?.id));
        toast.success("🗑️ Product removed from cart!", {
          position: "bottom-right",
          autoClose: 1500,
        });
      })
      .catch(() => {
        toast.error("❌ Failed to remove item!", {
          position: "bottom-right",
          autoClose: 1500,
        });
      });
  };

  const handleUpdateQuantity = (cartItem, typeOfAction) => {
    if (!user?.id) {
      toast.warn("⚠️ Please log in first!", { autoClose: 1500 });
      return;
    }

    if (typeOfAction === "plus") {
      const getCurrentProductIndex = productList.findIndex(
        (product) => product._id === cartItem?.productId
      );

      const getTotalStock =
        getCurrentProductIndex !== -1
          ? productList[getCurrentProductIndex].totalStock
          : 0;

      if (cartItem.quantity + 1 > getTotalStock) {
        toast.error(`Only ${getTotalStock} item(s) available.`, {
          position: "bottom-right",
          autoClose: 1500,
        });
        return;
      }
    }

    const newQuantity =
      typeOfAction === "plus"
        ? cartItem.quantity + 1
        : Math.max(1, cartItem.quantity - 1);

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: cartItem?.productId,
        quantity: newQuantity,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast.success("✅ Quantity updated!", {
          position: "bottom-right",
          autoClose: 1000,
        });
      }
    });
  };

  // 🧠 Fix: only show "No item in cart" when truly empty
  if (!cartItems || (Array.isArray(cartItems?.items) && cartItems.items.length === 0)) {
    return (
      <div className="text-center text-gray-500 py-8">
        No item in cart 🛒
      </div>
    );
  }

  // ✅ Support both single item and multiple items
  const itemsArray = Array.isArray(cartItems?.items)
    ? cartItems.items
    : [cartItems];

  return (
    <div className="p-2">
      {itemsArray.map((item) => (
        <div
          key={item.productId}
          className="flex items-center justify-between rounded-lg p-3 shadow-sm hover:shadow-md transition mb-2"
        >
          {/* Product Info */}
          <div className="flex items-center gap-4">
            <img
              src={item.image}
              alt={item.title}
              className="w-16 h-16 object-cover rounded-md border"
            />
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold text-gray-800 capitalize">
                {item.title}
              </h3>
              <div className="flex gap-2 items-center">
                <div
                  onClick={() =>
                    item.quantity > 1 && handleUpdateQuantity(item, "minus")
                  }
                  className={`cursor-pointer transition ${item.quantity === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:text-black"
                    }`}
                >
                  <CiCircleMinus size={20} />
                </div>

                <div className="text-[12px]">{item.quantity}</div>
                <div
                  onClick={() => handleUpdateQuantity(item, "plus")}
                  className="cursor-pointer text-gray-700 hover:text-black"
                >
                  <CiCirclePlus size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Total + Delete */}
          <div className="flex flex-col items-end gap-2">
            <p className="text-gray-700 font-semibold">
              ₹{(item.salePrice || item.price) * item.quantity}
            </p>

            <button
              className="text-red-500 hover:text-red-700 transition cursor-pointer"
              title="Remove item"
              onClick={() => handleCartItemDelete(item)}
            >
              <MdDeleteOutline size={22} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserCartContent;
