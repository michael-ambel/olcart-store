import { configureStore } from "@reduxjs/toolkit";
import { productApiSlice } from "./apiSlices/productApiSlice";
import { userApiSlice } from "./apiSlices/userApiSlice";
import productSlice from "./slices/productSlice";

const store = configureStore({
  reducer: {
    [productApiSlice.reducerPath]: productApiSlice.reducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,

    product: productSlice.reducer,
    user: userApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(productApiSlice.middleware)
      .concat(userApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
