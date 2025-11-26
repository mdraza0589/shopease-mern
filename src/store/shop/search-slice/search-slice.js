import { createSlice } from "@reduxjs/toolkit";
import { searchProducts } from "../../../../server/search";

const searchSlice = createSlice({
    name: "search",
    initialState: {
        searchResult: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        clearSearch: (state) => {
            state.searchResult = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(searchProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.searchResult = action.payload.data;
            })
            .addCase(searchProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearSearch } = searchSlice.actions;
export default searchSlice.reducer;