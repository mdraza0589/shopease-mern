import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const registerUser = createAsyncThunk(
    "/auth/register",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "https://shopease-backend-orpin.vercel.app/api/auth/register",
                formData,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Something went wrong" });
        }
    }
);

export const loginUser = createAsyncThunk(
    "/auth/login",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "https://shopease-backend-orpin.vercel.app/api/auth/login",
                formData,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Invalid credentials" });
        }
    }
);

export const checkAuth = createAsyncThunk(
    "/auth/checkAuth",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                "https://shopease-backend-orpin.vercel.app/api/auth/check-auth",
                {
                    withCredentials: true,
                    headers: {
                        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Something went wrong" }
            );
        }
    }
);



export const logoutUser = createAsyncThunk(
    "/auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "https://shopease-backend-orpin.vercel.app/api/auth/logout",
                {},
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Something went wrong" }
            );
        }
    }
);



