import { configureStore } from "@reduxjs/toolkit";
import { productApi } from "./apiSlices/productApiSlice";
import productSlice from "./slices/productSlice";

const store = configureStore({
  reducer: {
    [productApi.reducerPath]: productApi.reducer,
    product: productSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
