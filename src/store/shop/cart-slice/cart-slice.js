import { createSlice } from "@reduxjs/toolkit";
import { addToCart, deleteCartItem, fetchCartItems, updateCartQuantity } from "../../../../server/cart";

const initialState = {
    cartItems: [],
    isLoading: false,
};

const shoppingCartSlice = createSlice({
    name: "shoppingCart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addToCart.pending, (state) => {
            state.isLoading = true
        }).addCase(addToCart.fulfilled, (state, action) => {
            state.isLoading = false
            state.cartItems = action.payload.data
        }).addCase(addToCart.rejected, (state) => {
            state.isLoading = false,
                state.cartItems = []
        })
            .addCase(fetchCartItems.pending, (state) => {
                state.isLoading = true
            }).addCase(fetchCartItems.fulfilled, (state, action) => {
                state.isLoading = false
                state.cartItems = action.payload.data
            }).addCase(fetchCartItems.rejected, (state) => {
                state.isLoading = false,
                    state.cartItems = []
            })
            .addCase(updateCartQuantity.pending, (state) => {
                state.isLoading = true
            }).addCase(updateCartQuantity.fulfilled, (state, action) => {
                state.isLoading = false
                state.cartItems = action.payload.data
            }).addCase(updateCartQuantity.rejected, (state) => {
                state.isLoading = false,
                    state.cartItems = []
            })
            .addCase(deleteCartItem.pending, (state) => {
                state.isLoading = true
            }).addCase(deleteCartItem.fulfilled, (state, action) => {
                state.isLoading = false
                state.cartItems = action.payload.data
            }).addCase(deleteCartItem.rejected, (state) => {
                state.isLoading = false,
                    state.cartItems = []
            })
    }
});

export default shoppingCartSlice.reducer;

