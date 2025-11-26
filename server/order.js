import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://shopease-backend-orpin.vercel.app/api/shop/order";

// 🧾 Create Razorpay Order
export const createNewOrder = createAsyncThunk(
    "order/createNewOrder",
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/create`, orderData);
            return response.data;
        } catch (error) {
            console.error("Error creating new order:", error);
            return rejectWithValue(error.response?.data || { message: "Error creating order" });
        }
    }
);

// ✅ Verify Razorpay Payment
export const verifyPayment = createAsyncThunk(
    "order/verifyPayment",
    async (paymentData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/verify`, paymentData);
            return response.data;
        } catch (error) {
            console.error("Error verifying payment:", error);
            return rejectWithValue(error.response?.data || { message: "Payment verification failed" });
        }
    }
);

// 📦 Get All Orders by User
export const fetchUserOrders = createAsyncThunk(
    "order/fetchUserOrders",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/list/${userId}`);
            return response.data.orders;
        } catch (error) {
            console.error("Error fetching user orders:", error);
            return rejectWithValue(error.response?.data || { message: "Failed to fetch orders" });
        }
    }
);

// 🔍 Get Single Order Details
export const fetchOrderDetails = createAsyncThunk(
    "order/fetchOrderDetails",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/details/${id}`);
            return response.data.order;
        } catch (error) {
            console.error("Error fetching order details:", error);
            return rejectWithValue(error.response?.data || { message: "Failed to fetch order details" });
        }
    }
);




