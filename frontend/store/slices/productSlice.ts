import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPCart, Product } from "../types/productTypes";

interface ProductState {
  products: Product[];
  cartedItems: IPCart[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  cartedItems: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      state.products = action.payload;
    },
    setCartedItems(state, action: PayloadAction<IPCart[]>) {
      state.cartedItems = action.payload;
    },
    setSelectedProduct(state, action: PayloadAction<Product | null>) {
      state.selectedProduct = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setProducts,
  setCartedItems,
  setSelectedProduct,
  setLoading,
  setError,
} = productSlice.actions;
export default productSlice;
