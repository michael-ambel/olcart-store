import { configureStore } from "@reduxjs/toolkit";

import { productApiSlice } from "./apiSlices/productApiSlice";
import { userApiSlice } from "./apiSlices/userApiSlice";
import { categoryApiSlice } from "./apiSlices/categoryApiSlice";

import productSlice from "./slices/productSlice";
import userSlice from "./slices/userSlice";
import categorySlice from "./slices/categorySlice";

const store = configureStore({
  reducer: {
    [productApiSlice.reducerPath]: productApiSlice.reducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [categoryApiSlice.reducerPath]: categorySlice.reducer,

    product: productSlice.reducer,
    user: userSlice.reducer,
    category: categorySlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(productApiSlice.middleware)
      .concat(userApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
