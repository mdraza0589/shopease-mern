import { createSlice } from '@reduxjs/toolkit';
import { addNewProduct, fetchProduct } from '../../../../server/product';

const initialState = {
    isLoading: false,
    productList: [],
};

const AdminProductSlice = createSlice({
    name: 'adminProducts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Products
            .addCase(fetchProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.productList = (action.payload && action.payload.data) || [];
            })
            .addCase(fetchProduct.rejected, (state) => {
                state.isLoading = false;
                state.productList = [];
            })

            // Add New Product
            .addCase(addNewProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addNewProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                // ensure productList is an array before pushing
                if (!Array.isArray(state.productList)) state.productList = [];
                if (action.payload && action.payload.data) state.productList.push(action.payload.data);
            })
            .addCase(addNewProduct.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export default AdminProductSlice.reducer;




