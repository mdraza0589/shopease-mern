import React, { useEffect, useState } from 'react';
import Address from './address';
import { useDispatch, useSelector } from 'react-redux';
import UserCartContent from '../../components/shopping-view/cart-items-content';
import { toast } from 'react-toastify';
import { createNewOrder, verifyPayment } from '../../../server/order';

const CheckOutPage = () => {
    const { cartItems } = useSelector((state) => state.shopCart);
    const { user } = useSelector((state) => state.auth);
    const [currentSelectedAddress, setcurrentSelectedAddress] = useState(null);
    const dispatch = useDispatch();

    const totalCartAmount = cartItems?.items?.length
        ? cartItems.items.reduce((sum, currentItem) => {
            const price = currentItem.salePrice > 0 ? currentItem.salePrice : currentItem.price;
            return sum + price * currentItem.quantity;
        }, 0)
        : 0;

    const initiateRazorpayPayment = (data) => {
        if (!window.Razorpay) {
            alert("⚠ Payment gateway script not loaded");
            return;
        }

        const options = {
            key: data.key,
            amount: data.razorpayOrder.amount,
            currency: data.razorpayOrder.currency,
            name: 'ShopEase',
            description: 'Order Payment',
            order_id: data.razorpayOrder.id,
            handler: async (response) => {
                const paymentData = {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    orderDbId: data.dbOrderId,
                };

                const verifyResult = await dispatch(verifyPayment(paymentData));
                verifyResult?.payload?.success
                    ? alert('✅ Payment Successful!')
                    
                    : alert('❌ Payment verification failed!');
            },
            prefill: {
                name: user?.userName,
                email: user?.email,
            },
            theme: {
                color: '#f59e0b',
            },
        };

        new window.Razorpay(options).open();
    };

    const handleRozarpayInitiate = async () => {


        if (!currentSelectedAddress?._id) {
            toast.warn("Select an address");
            return;
        }

        if (!cartItems?.items?.length) {
            toast.error("Add cart items first.");
            return;
        }

        const outOfStockItems = cartItems.items.filter(
            (item) => item?.productId?.totalStock <= 0
        );

        if (outOfStockItems.length > 0) {
            alert(`⚠ Out of stock: ${outOfStockItems.map(i => i?.title || "Item").join(", ")}`);
            return;
        }

        const orderData = {
            userId: user?.id,
            cartId: cartItems?._id,
            cartItems: cartItems.items,
            addressInfo: currentSelectedAddress,
            totalAmount: totalCartAmount,
            orderStatus: 'Pending',
            paymentMethod: 'Razorpay',
            paymentStatus: 'Pending',
            orderDate: new Date(),
        };

        const result = await dispatch(createNewOrder(orderData));
        if (result?.payload?.success) initiateRazorpayPayment(result.payload);
        else toast.warn('Error creating order.');

    };

    return (
        <div className="flex flex-col">
            <div className="relative h-[350px] w-full overflow-hidden">
                <img
                    className="h-full w-full object-cover"
                    src="https://cdn.pixabay.com/photo/2020/05/25/02/44/golf-5216737_1280.jpg"
                    alt="Checkout Banner"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 p-5">
                <Address
                    setcurrentSelectedAddress={setcurrentSelectedAddress}
                    currentSelectedAddress={currentSelectedAddress}
                />

                <div>
                    {cartItems?.items?.length ? cartItems.items.map((item, i) => (
                        <UserCartContent key={i} cartItems={item} />
                    )) : (
                        <p className="text-gray-500 text-center py-10">No items in cart 🛒</p>
                    )}

                    <div className="flex justify-between mt-6 border-t pt-4 text-lg font-semibold">
                        <span>Total</span>
                        <span>₹{totalCartAmount.toFixed(2)}</span>
                    </div>

                    <button
                        onClick={handleRozarpayInitiate}
                        className="p-2 bg-amber-600 w-full mt-8 rounded-sm text-white hover:bg-amber-500 font-bold"
                    >
                        Checkout with Razorpay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckOutPage;
