import { configureStore } from "@reduxjs/toolkit";

import { productApiSlice } from "./apiSlices/productApiSlice";
import { userApiSlice } from "./apiSlices/userApiSlice";
import { categoryApiSlice } from "./apiSlices/categoryApiSlice";
import { orderApiSlice } from "./apiSlices/orderApiSlice";

import productSlice from "./slices/productSlice";
import userSlice from "./slices/userSlice";
import categorySlice from "./slices/categorySlice";
import orderSlice from "./slices/orderSlice";

const store = configureStore({
  reducer: {
    [productApiSlice.reducerPath]: productApiSlice.reducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [categoryApiSlice.reducerPath]: categoryApiSlice.reducer,
    [orderApiSlice.reducerPath]: orderApiSlice.reducer,

    product: productSlice.reducer,
    user: userSlice.reducer,
    category: categorySlice.reducer,
    order: orderSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(productApiSlice.middleware)
      .concat(userApiSlice.middleware)
      .concat(categoryApiSlice.middleware)
      .concat(orderApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
