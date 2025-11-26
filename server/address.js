import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://shopease-backend-orpin.vercel.app/api/shop/address";

// ✅ 1️⃣ Add New Address
export const addNewAddress = createAsyncThunk(
    "address/addNewAddress",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/add`, formData, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Error adding address!" }
            );
        }
    }
);

// ✅ 2️⃣ Fetch All Addresses
export const fetchAllAddress = createAsyncThunk(
    "address/fetchAllAddress",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/get/${userId}`, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Error fetching addresses!" }
            );
        }
    }
);

// ✅ 3️⃣ Delete Address
export const deleteAddress = createAsyncThunk(
    "address/deleteAddress",
    async ({ userId, addressId }, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_URL}/delete/${userId}/${addressId}`, {
                withCredentials: true,
            });
            return { addressId, ...response.data };
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Error deleting address!" }
            );
        }
    }
);

// ✅ 4️⃣ Edit (Update) Address
export const editAddress = createAsyncThunk(
    "address/editAddress",
    async ({ userId, addressId, formData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/update/${userId}/${addressId}`, formData, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Error updating address!" }
            );
        }
    }
);


