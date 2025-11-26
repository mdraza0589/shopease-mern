import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../src/api/axios"; // use configured axios

const API_ROUTE = "/api/shop/cart";

// 1️⃣ Add item to cart
export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ userId, productId, quantity }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_ROUTE}/add`, {
                userId,
                productId,
                quantity,
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to add item to cart"
            );
        }
    }
);

// 2️⃣ Get user cart items
export const fetchCartItems = createAsyncThunk(
    "cart/fetchCartItems",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_ROUTE}/get/${userId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch cart items"
            );
        }
    }
);

// 3️⃣ Update cart quantity
export const updateCartQuantity = createAsyncThunk(
    "cart/updateCartQuantity",
    async ({ userId, productId, quantity }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_ROUTE}/update-cart`, {
                userId,
                productId,
                quantity,
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update cart quantity"
            );
        }
    }
);

// 4️⃣ Delete item from cart
export const deleteCartItem = createAsyncThunk(
    "cart/deleteCartItem",
    async ({ userId, productId }, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                `${API_ROUTE}/${userId}/${productId}`
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to remove item from cart"
            );
        }
    }
);
