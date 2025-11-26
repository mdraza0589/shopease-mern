import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../src/api/axios"; 

const API_ROUTE = "/api/shop/address";

// 1️⃣ Add New Address
export const addNewAddress = createAsyncThunk(
  "address/addNewAddress",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_ROUTE}/add`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Error adding address!" }
      );
    }
  }
);

// 2️⃣ Fetch All Addresses
export const fetchAllAddress = createAsyncThunk(
  "address/fetchAllAddress",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_ROUTE}/get/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Error fetching addresses!" }
      );
    }
  }
);

// 3️⃣ Delete Address
export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async ({ userId, addressId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_ROUTE}/delete/${userId}/${addressId}`);
      return { addressId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Error deleting address!" }
      );
    }
  }
);

// 4️⃣ Edit (Update) Address
export const editAddress = createAsyncThunk(
  "address/editAddress",
  async ({ userId, addressId, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_ROUTE}/update/${userId}/${addressId}`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Error updating address!" }
      );
    }
  }
);
