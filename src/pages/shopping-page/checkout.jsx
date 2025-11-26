import React, { useEffect, useState } from 'react';
import Address from './address';
import { useDispatch, useSelector } from 'react-redux';
import UserCartContent from '../../components/shopping-view/cart-items-content';
import { createNewOrder, verifyPayment } from '../../../server/order';
import { toast } from 'react-toastify';

const CheckOutPage = () => {
    const { cartItems } = useSelector((state) => state.shopCart);
    const { user } = useSelector((state) => state.auth);
    const [currentSelectedAddress, setcurrentSelectedAddress] = useState(null);
    const dispatch = useDispatch();

    const totalCartAmount =
        cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.reduce((sum, currentItem) => {
                const price =
                    currentItem?.salePrice > 0
                        ? currentItem.salePrice
                        : currentItem.price;
                return sum + price * currentItem.quantity;
            }, 0)
            : 0;

    const initiateRazorpayPayment = (data) => {
        const options = {
            key: data.key,
            amount: data.razorpayOrder.amount,
            currency: data.razorpayOrder.currency,
            name: 'ShopEeas',
            description: 'Order Payment',
            order_id: data.razorpayOrder.id, // ✅ Correct Razorpay order ID
            handler: async function (response) {
                const paymentData = {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    orderDbId: data.dbOrderId, // local DB order ID
                };

                try {
                    const verifyResult = await dispatch(verifyPayment(paymentData));
                    if (verifyResult?.payload?.success) {
                        alert('✅ Payment Successful!');
                    } else {
                        alert('❌ Payment verification failed!');
                    }
                } catch (error) {
                    console.error("Error verifying payment:", error);
                    alert('❌ Payment verification failed!');
                }
            },
            prefill: {
                name: user?.name,
                email: user?.email,
            },
            theme: {
                color: '#f59e0b',
            },
        };

        const razor = new window.Razorpay(options);
        razor.open();
    };

    const handleRozarpayInitiate = async () => {
        if (!currentSelectedAddress) {
            toast.warn("Select any address");
            return;
        }

        if (!cartItems?.items || cartItems.items.length === 0) {
            toast.error("Add cart items first.");
            return;
        }

        
        const outOfStockItems = cartItems.items.filter(
            (item) => item?.productId?.totalStock <= 0
        );

        if (outOfStockItems.length > 0) {
            const names = outOfStockItems
                .map((i) => i?.title || i?.productId?.title || "Unknown Product")
                .join(", ");
            alert(`⚠️ These items are out of stock: ${names}`);
            return;
        }



        const orderData = {
            userId: user?.id,
            cartId: cartItems?._id,
            cartItems: cartItems.items.map((item) => ({
                productId: item?.productId,
                title: item?.title,
                image: item?.image,
                price: item?.price,
                salePrice: item?.salePrice,
                quantity: item?.quantity,
            })),
            addressInfo: {
                addressId: currentSelectedAddress?._id,
                address: currentSelectedAddress?.address,
                city: currentSelectedAddress?.city,
                pincode: currentSelectedAddress?.pincode,
                phone: currentSelectedAddress?.phone,
                notes: currentSelectedAddress?.notes,
            },
            totalAmount: totalCartAmount,
            orderStatus: 'Pending',
            paymentMethod: 'Razorpay',
            paymentStatus: 'Pending',
            orderDate: new Date(),
            orderUpdateDate: new Date(),
            paymentId: '',
            payerId: '',
        };

        console.log('✅ Order Data Created:', orderData);

        const result = await dispatch(createNewOrder(orderData));
        const data = result?.payload;

        if (data?.success) {
            initiateRazorpayPayment(data);
        } else {
            toast.warn('Add Items in cart');
        }
    };

    useEffect(() => {
        console.log('cartItems', cartItems);
        console.log('currentSelectedAddress = ', currentSelectedAddress);
    }, [cartItems, currentSelectedAddress]);

    return (
        <div className="flex flex-col">
            {/* 🖼️ Banner */}
            <div className="relative h-[350px] w-full overflow-hidden">
                <img
                    className="h-full w-full object-cover"
                    src="https://cdn.pixabay.com/photo/2020/05/25/02/44/golf-5216737_1280.jpg"
                    alt="Checkout Banner"
                />
            </div>

            {/* 🧾 Checkout Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 p-5">
                {/* Address */}
                <Address
                    setcurrentSelectedAddress={setcurrentSelectedAddress}
                    currentSelectedAddress={currentSelectedAddress}
                />

                {/* Cart Items */}
                <div>
                    {cartItems?.items && cartItems.items.length > 0 ? (
                        cartItems.items.map((cartItem, index) => (
                            <UserCartContent key={index} cartItems={cartItem} />
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-10">
                            No items in your cart 🛒
                        </p>
                    )}
                    <div className="flex justify-between mt-6 border-t border-gray-200 pt-4 text-lg font-semibold">
                        <span>Total</span>
                        <span>₹{totalCartAmount.toFixed(2)}</span>
                    </div>
                    <div>
                        <button
                            onClick={handleRozarpayInitiate}
                            className="p-2 bg-amber-600 w-full mt-8 rounded-sm cursor-pointer hover:bg-amber-500 text-white font-bold"
                        >
                            Checkout with Razorpay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckOutPage;
