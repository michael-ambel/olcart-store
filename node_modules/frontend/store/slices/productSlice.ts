import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Filters, IPCart, Product } from "../types/productTypes";

interface ProductState {
  products: Product[];
  cartedItems: IPCart[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  filters: Filters;
}

const initialState: ProductState = {
  products: [],
  cartedItems: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  searchQuery: "",
  filters: {
    category: "",
    priceMin: 0,
    tags: [],
    sort: "popularity",
    page: 1,
    limit: 20,
  },
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
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setFilters(state, action: PayloadAction<Filters>) {
      state.filters = action.payload;
    },
  },
});

export const {
  setProducts,
  setCartedItems,
  setSelectedProduct,
  setLoading,
  setError,
  setSearchQuery,
  setFilters,
} = productSlice.actions;
export default productSlice;
