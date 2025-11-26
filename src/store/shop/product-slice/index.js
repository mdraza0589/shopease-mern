import { createSlice } from '@reduxjs/toolkit';
import { fetchFilteredProduct, fetchProductDetails } from '../../../../server/product';


const initialState = {
    isLoading: false,
    productList: [],
    productDetails: null
}


const shopingProductSlice = createSlice({
    name: 'shoppingProducts',
    initialState,
    reducers: {
        setProductDetails: (state) => {
            state.productDetails = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFilteredProduct.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(fetchFilteredProduct.fulfilled, (state, action) => {
                state.isLoading = false
                state.productList = (action.payload && action.payload.data) || []
            })
            .addCase(fetchFilteredProduct.rejected, (state, action) => {
                state.isLoading = false
            })
            .addCase(fetchProductDetails.pending, (state, action) => {
                state.isLoading = true
                state.productDetails = null

            })
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.isLoading = false
                state.productDetails = action.payload
            })
            .addCase(fetchProductDetails.rejected, (state, action) => {
                state.isLoading = false
                state.productDetails = null
            })

    }
})
export const { setProductDetails } = shopingProductSlice.actions
export default shopingProductSlice.reducer

