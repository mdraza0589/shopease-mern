import { createSlice } from "@reduxjs/toolkit";
import {
    GetAllOrdersForAdmin,
    getOrderDetailsForAdmin,
    updateOrderStatus,
} from "../../../../server/admin-order";

const initialState = {
    ordersList: [],
    orderDetails: null,
    isLoading: false,
    error: null,
};

const AdminOrderSlice = createSlice({
    name: "adminOrder",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // --- Get All Orders ---
            .addCase(GetAllOrdersForAdmin.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(GetAllOrdersForAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.ordersList = action.payload || [];
            })
            .addCase(GetAllOrdersForAdmin.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Failed to load orders";
            })

            // --- Get Order Details ---
            .addCase(getOrderDetailsForAdmin.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderDetails = action.payload || null;
            })
            .addCase(getOrderDetailsForAdmin.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Failed to load order details";
            })

            // --- Update Order Status ---
            .addCase(updateOrderStatus.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderDetails = action.payload; // ✅ Update current order details
                // Optionally refresh list or find & update the changed one
                const index = state.ordersList.findIndex(
                    (order) => order._id === action.payload._id
                );
                if (index !== -1) {
                    state.ordersList[index] = action.payload;
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Failed to update order";
            });
    },
});

export default AdminOrderSlice.reducer;
