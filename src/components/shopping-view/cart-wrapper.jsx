import { useNavigate } from "react-router-dom";
import UserCartContent from "./cart-items-content";

const CartWrapper = ({ cartItems, setIsCartOpen,  }) => {
    const navigate = useNavigate();
    // ✅ Fix: added "return" inside reduce
    const totalCartAmount =
        cartItems && cartItems.length > 0
            ? cartItems.reduce((sum, currentItem) => {
                const price =
                    currentItem?.salePrice > 0
                        ? currentItem.salePrice
                        : currentItem.price;
                return sum + price * currentItem.quantity;
            }, 0)
            : 0;
    const handleCheckOut = () => {
        setIsCartOpen(false); // close cart
        navigate('/shop/checkout');
    };
    return (
        <div className="min-h-screen bg-gray-50 pb-26 relative">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-10 flex items-center gap-2">
                    🛍️ Your Cart
                </h2>

                {/* 🧩 Cart Items */}
                <div>
                    {cartItems && cartItems.length > 0 ? (
                        cartItems.map((item, index) => (
                            <UserCartContent key={index} cartItems={item} />
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-10">No items in cart 🛒</p>
                    )}
                </div>

                <div className="flex justify-between mt-6 border-t border-gray-200 pt-4 text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{totalCartAmount.toFixed(2)}</span>
                </div>
            </div>

            <button onClick={() => handleCheckOut()} className="w-full bg-amber-500 p-3 mt-6 rounded-xl text-white font-bold cursor-pointer hover:bg-amber-400">
                Checkout
            </button>
        </div>
    );
};

export default CartWrapper;


