import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser, ICartItem } from "../types/userTypes";

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

    addCartItem(state, action: PayloadAction<ICartItem>) {
      state.cart.push(action.payload);
    },

    updateCartItem(
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) {
      const { productId, quantity } = action.payload;
      const existingItem = state.cart.find(
        (item) => item.product === productId
      );

      if (existingItem) {
        if (quantity > 0) {
          existingItem.quantity = quantity;
        } else {
          state.cart = state.cart.filter((item) => item.product !== productId);
        }
      }
    },
  },
});

export const { setUser, clearUser, setCart, addCartItem, updateCartItem } =
  userSlice.actions;

export default userSlice;
