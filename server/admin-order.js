import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://shopease-backend-orpin.vercel.app/api/admin/orders";

// ✅ FIXED: Correct async signature
export const GetAllOrdersForAdmin = createAsyncThunk(
    "order/GetAllOrdersForAdmin",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/get`);
            return response.data.orders;
        } catch (error) {
            console.error("Error fetching user orders:", error);
            return rejectWithValue(error.response?.data || { message: "Failed to fetch orders" });
        }
    }
);

export const getOrderDetailsForAdmin = createAsyncThunk(
    "order/getOrderDetailsForAdmin",
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



export const updateOrderStatus = createAsyncThunk(
    "order/updateOrderStatus",
    async ({ id, orderStatus }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${BASE_URL}/update/${id}`, { orderStatus });
            return response.data.order;
        } catch (error) {
            console.error("Error updating order status:", error);
            return rejectWithValue(error.response?.data || { message: "Failed to update order status" });
        }
    }
);



