import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../src/api/axios"; // Using global axios instance

const API_ROUTE = "/api/shop/search";

// 🔍 Search products by keyword
export const searchProducts = createAsyncThunk(
    "search/searchProducts",
    async (keyword, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_ROUTE}/${keyword}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to search products"
            );
        }
    }
);
