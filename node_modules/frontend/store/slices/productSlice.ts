import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../types/productTypes";

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProduct(state, action: PayloadAction<Product[]>) {
      state.products = action.payload;
    },
    setSelectedProduct(state, action: PayloadAction<Product | null>) {
      state.selectedProduct = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setDefaultResultOrder(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setProduct,
  setSelectedProduct,
  setLoading,
  setDefaultResultOrder,
} = productSlice.actions;
export default productSlice;
