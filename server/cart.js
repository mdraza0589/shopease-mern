import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

let BASE_URL = "http://localhost:5000/api/shop/cart";


export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ userId, productId, quantity }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/add`, {
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




export const fetchCartItems = createAsyncThunk(
    "cart/fetchCartItems",
    async (userId, { rejectWithValue }) => {
        try {

            const response = await axios.get(`${BASE_URL}/get/${userId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch cart items"
            );
        }
    }
);



export const updateCartQuantity = createAsyncThunk(
    "cart/updateCartQuantity",
    async ({ userId, productId, quantity }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${BASE_URL}/update-cart`, {
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

export const deleteCartItem = createAsyncThunk(
    "cart/deleteCartItem",
    async ({ userId, productId }, { rejectWithValue }) => {
        try {
            const res = await axios.delete(`${BASE_URL}/${userId}/${productId}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Failed to remove item from cart"
            );
        }
    }
);

