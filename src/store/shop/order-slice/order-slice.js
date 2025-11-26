import { createSlice } from "@reduxjs/toolkit";
import {
    createNewOrder,
    verifyPayment,
    fetchUserOrders,
    fetchOrderDetails,
} from "../../../../server/order";

const initialState = {
    approvalURL: null,
    isLoading: false,
    orderId: null,
    paymentVerified: false,
    error: null,
    ordersList: [], // 🧾 All user orders
    selectedOrder: null, // 🔍 Single order details
};

const shoppingOrderSlice = createSlice({
    name: "shoppingOrderSlice",
    initialState,
    reducers: {
        resetOrderState: (state) => {
            state.approvalURL = null;
            state.orderId = null;
            state.error = null;
            state.isLoading = false;
            state.paymentVerified = false;
            state.orders = [];
            state.selectedOrder = null;
        },
    },
    extraReducers: (builder) => {
        builder
            /* ---------------- CREATE ORDER ---------------- */
            .addCase(createNewOrder.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createNewOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderId = action.payload.dbOrderId;
                state.approvalURL = action.payload.key;
            })
            .addCase(createNewOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Failed to create order";
            })

            /* ---------------- VERIFY PAYMENT ---------------- */
            .addCase(verifyPayment.pending, (state) => {
                state.isLoading = true;
                state.paymentVerified = false;
            })
            .addCase(verifyPayment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.paymentVerified = true;
                state.selectedOrder = action.payload.order;
                state.error = null;
            })
            .addCase(verifyPayment.rejected, (state, action) => {
                state.isLoading = false;
                state.paymentVerified = false;
                state.error = action.payload?.message || "Payment verification failed";
            })

            /* ---------------- FETCH ALL USER ORDERS ---------------- */
            .addCase(fetchUserOrders.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.ordersList = action.payload;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Failed to load orders";
            })

            /* ---------------- FETCH SINGLE ORDER ---------------- */
            .addCase(fetchOrderDetails.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchOrderDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedOrder = action.payload;
            })
            .addCase(fetchOrderDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Failed to load order details";
            });
    },
});

export const { resetOrderState } = shoppingOrderSlice.actions;
export default shoppingOrderSlice.reducer;
