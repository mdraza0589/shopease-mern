import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://shopease-backend-orpin.vercel.app/api/shop/review";

/* 📝 Add a new product review */
export const addProductReview = createAsyncThunk(
    "review/addProductReview",
    async ({ userId, productId, rating, comment }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/add`, {
                userId,
                productId,
                rating,
                comment,
            });

            // ✅ Backend returns { success, message, review }
            return response.data.review;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to add review"
            );
        }
    }
);

/* 📦 Get all reviews for a specific product */
export const getProductReview = createAsyncThunk(
    "review/getProductReview",
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/${productId}`);

            // ✅ Backend returns { success, reviews }
            return response.data.reviews;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch reviews"
            );
        }
    }
);


