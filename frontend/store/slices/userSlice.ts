import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser, ICartItem, IShippingAddress } from "../types/userTypes";

interface UserState {
  user: IUser | null;
  cart: ICartItem[];
}

const initialState: UserState = {
  user: null,
  cart: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
    },

    clearUser(state) {
      state.user = null;
      state.cart = [];
    },

    setCart(state, action: PayloadAction<ICartItem[]>) {
      state.cart = action.payload;
    },

    updateCart(state, action: PayloadAction<ICartItem[]>) {
      // Replace the entire cart with the updated cart received from the backend
      state.cart = action.payload;
    },

    userInitalizer(state) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        state.user = JSON.parse(storedUser);
      }
    },

    cartInitalizer(state) {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        state.cart = JSON.parse(storedCart);
      }
    },
  },
});

export const {
  setUser,
  clearUser,
  setCart,
  updateCart,
  userInitalizer,
  cartInitalizer,
} = userSlice.actions;

export default userSlice;
