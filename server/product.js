import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../src/api/axios.js';

// Add new product
export const addNewProduct = createAsyncThunk(
    "/product/addNewProduct",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "/api/admin/products/add",
                formData,
                { headers: { "Content-Type": "application/json" } }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to add new product");
        }
    }
);

// Get all products
export const fetchProduct = createAsyncThunk(
    "/product/fetchProduct",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/admin/products/get");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
        }
    }
);

// Filter products
export const fetchFilteredProduct = createAsyncThunk(
    "/product/fetchFilteredProduct",
    async ({ filterParams, sortParams }, { rejectWithValue }) => {
        try {
            const query = new URLSearchParams({
                ...filterParams,
                sortBy: sortParams,
            });

            const response = await axios.get(`/api/shop/products/get?${query}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
        }
    }
);

// Single product details
export const fetchProductDetails = createAsyncThunk(
    "/product/productDetails",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/shop/products/get/${id}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch product details");
        }
    }
);

// Edit product
export const editProduct = createAsyncThunk(
    "/product/editProduct",
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `/api/admin/products/edit/${id}`,
                formData,
                { headers: { "Content-Type": "application/json" } }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to edit product");
        }
    }
);

// Delete product
export const deleteProduct = createAsyncThunk(
    "/product/deleteProduct",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`/api/admin/products/delete/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete product");
        }
    }
);
