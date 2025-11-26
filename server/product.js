import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const addNewProduct = createAsyncThunk(
    "/product/addNewProduct",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "https://shopease-backend-orpin.vercel.app/api/admin/products/add",
                formData,
                { headers: { "Content-Type": "application/json" } }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to add new product");
        }
    }
);


export const fetchProduct = createAsyncThunk(
    "/product/fetchProduct",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                "https://shopease-backend-orpin.vercel.app/api/admin/products/get"
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch products"
            );
        }
    }
);


export const fetchFilteredProduct = createAsyncThunk(
    "/product/fetchProduct",
    async ({ filterParams, sortParams }, { rejectWithValue }) => {
        try {
            const query = new URLSearchParams({
                ...filterParams,
                sortBy: sortParams,
            });

            const response = await axios.get(
                `https://shopease-backend-orpin.vercel.app/api/shop/products/get?${query}`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch products"
            );
        }
    }
);


export const fetchProductDetails = createAsyncThunk(
    "/product/productDetails",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `https://shopease-backend-orpin.vercel.app/api/shop/products/get/${id}`
            );
            // return only the useful data for the reducer
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch products"
            );
        }
    }
);



export const editProduct = createAsyncThunk(
    "/product/editProduct",
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `https://shopease-backend-orpin.vercel.app/api/admin/products/edit/${id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to edit product"
            );
        }
    }
);



export const deleteProduct = createAsyncThunk(
    "/product/deleteProduct",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                `https://shopease-backend-orpin.vercel.app/api/admin/products/delete/${id}`
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete product"
            );
        }
    }
);
