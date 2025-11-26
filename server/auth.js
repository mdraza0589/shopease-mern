import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../src/api/axios"; // use configured axios

const AUTH_ROUTE = "/api/auth";

// 1️⃣ Register User
export const registerUser = createAsyncThunk(
    "/auth/register",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${AUTH_ROUTE}/register`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Something went wrong" }
            );
        }
    }
);

// 2️⃣ Login User
export const loginUser = createAsyncThunk(
    "/auth/login",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${AUTH_ROUTE}/login`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Invalid credentials" }
            );
        }
    }
);

// 3️⃣ Check Authentication Status
export const checkAuth = createAsyncThunk(
    "/auth/checkAuth",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${AUTH_ROUTE}/check-auth`, {
                headers: {
                    "Cache-Control":
                        "no-store, no-cache, must-revalidate, proxy-revalidate",
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Session expired or unauthorized" }
            );
        }
    }
);

// 4️⃣ Logout User
export const logoutUser = createAsyncThunk(
    "/auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${AUTH_ROUTE}/logout`, {});
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Something went wrong" }
            );
        }
    }
);
