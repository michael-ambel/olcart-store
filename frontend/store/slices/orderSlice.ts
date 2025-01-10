import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IOrder, IOrderItem } from "../types/orderTypes";
import { IShippingAddress } from "../types/userTypes";

interface OrderState {
  orders: IOrder[];
  currentItems?: IOrderItem[];
  currentAddress?: IShippingAddress;
}

const initialState: OrderState = {
  orders: [],
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<IOrder[]>) => {
      state.orders = action.payload;
    },
    setCurrentOrder: (state, action: PayloadAction<IOrderItem[]>) => {
      state.currentItems = action.payload;
    },
    setCurrentAddress: (state, action: PayloadAction<IShippingAddress>) => {
      state.currentAddress = action.payload;
    },
  },
});

export const { setOrders, setCurrentOrder, setCurrentAddress } =
  orderSlice.actions;
export default orderSlice;
