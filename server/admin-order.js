import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../src/api/axios.js'

const API_ROUTE = "/api/admin/orders";

// 1️⃣ Get all orders (Admin)
export const GetAllOrdersForAdmin = createAsyncThunk(
    "order/GetAllOrdersForAdmin",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_ROUTE}/get`);
            return response.data.orders;
        } catch (error) {
            console.error("Error fetching user orders:", error);
            return rejectWithValue(
                error.response?.data || { message: "Failed to fetch orders" }
            );
        }
    }
);

// 2️⃣ Get Single Order Details (Admin)
export const getOrderDetailsForAdmin = createAsyncThunk(
    "order/getOrderDetailsForAdmin",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_ROUTE}/details/${id}`);
            return response.data.order;
        } catch (error) {
            console.error("Error fetching order details:", error);
            return rejectWithValue(
                error.response?.data || { message: "Failed to fetch order details" }
            );
        }
    }
);

// 3️⃣ Update Order Status (Admin)
export const updateOrderStatus = createAsyncThunk(
    "order/updateOrderStatus",
    async ({ id, orderStatus }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_ROUTE}/update/${id}`, {
                orderStatus,
            });
            return response.data.order;
        } catch (error) {
            console.error("Error updating order status:", error);
            return rejectWithValue(
                error.response?.data || { message: "Failed to update order status" }
            );
        }
    }
);
