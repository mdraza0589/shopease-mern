import { configureStore } from "@reduxjs/toolkit";

import authReducer from './auth-slice'
import AdminProductSlice from './admin/product-slice'
import shopingProductSlice from "./shop/product-slice";
import shoppingCartSlice from "./shop/cart-slice/cart-slice";
import addressSlice from "./shop/address-slice/address-slice";
import shoppingOrderSlice from "./shop/order-slice/order-slice";
import AdminOrderSlice from "./admin/order-slice/order-slice";
import searchSlice from "./shop/search-slice/search-slice";
import reviewSlice from "./shop/review-slice/review-slice";


const store = configureStore({
    reducer: {
        auth: authReducer,

        adminproducts: AdminProductSlice,
        adminOrder: AdminOrderSlice,

        shopProducts: shopingProductSlice,
        shopCart: shoppingCartSlice,
        shopAddress: addressSlice,
        shopOrder: shoppingOrderSlice,

        search: searchSlice,

        review: reviewSlice
    }
})


export default store;
