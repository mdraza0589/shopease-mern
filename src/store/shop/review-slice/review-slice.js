import { createSlice } from "@reduxjs/toolkit";
import { addProductReview, getProductReview } from "../../../../server/review";

const reviewSlice = createSlice({
    name: "review",
    initialState: {
        reviews: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            /* Fetch Reviews */
            .addCase(getProductReview.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProductReview.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload || [];
            })
            .addCase(getProductReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* Add Review */
            .addCase(addProductReview.fulfilled, (state, action) => {
                if (action.payload?.success) {
                    // Optionally push new review for instant update
                    state.reviews.push(action.payload.review);
                }
            })
            .addCase(addProductReview.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export default reviewSlice.reducer;

