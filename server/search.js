import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/shop/search";

// 🔍 Search products by keyword
export const searchProducts = createAsyncThunk(
    "search/searchProducts",
    async (keyword, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/${keyword}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to search products"
            );
        }
    }
);


