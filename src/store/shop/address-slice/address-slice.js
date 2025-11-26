import { createSlice } from "@reduxjs/toolkit";
import {
    addNewAddress,
    fetchAllAddress,
    deleteAddress,
    editAddress
} from "../../../../server/address";

const initialState = {
    isLoading: false,
    addressList: [],
    error: null,
};

const addressSlice = createSlice({
    name: "address",
    initialState,
    reducers: {
        clearAddressError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            /* 🟢 FETCH ALL ADDRESSES */
            .addCase(fetchAllAddress.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.addressList = action.payload?.data || [];
                state.error = null;
            })
            .addCase(fetchAllAddress.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Failed to fetch addresses";
            })

            /* 🟢 ADD NEW ADDRESS */
            .addCase(addNewAddress.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addNewAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload?.data) {
                    state.addressList.push(action.payload.data);
                }
                state.error = null;
            })
            .addCase(addNewAddress.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Failed to add address";
            })

            /* 🟢 DELETE ADDRESS */
            .addCase(deleteAddress.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.addressList = state.addressList.filter(
                    (addr) => addr._id !== action.payload.addressId
                );
                state.error = null;
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Failed to delete address";
            })

            /* 🟢 EDIT ADDRESS */
            .addCase(editAddress.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(editAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                const updated = action.payload?.data;
                if (updated) {
                    const index = state.addressList.findIndex(
                        (addr) => addr._id === updated._id
                    );
                    if (index !== -1) {
                        state.addressList[index] = updated;
                    }
                }
                state.error = null;
            })
            .addCase(editAddress.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Failed to update address";
            });
    },
});

export const { clearAddressError } = addressSlice.actions;
export default addressSlice.reducer;
