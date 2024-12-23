import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IOrder } from "../types/orderTypes";

interface OrderState {
  orders: IOrder[];
  currentOrder?: IOrder;
}

const initialState: OrderState = {
  orders: [],
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    //set order
    setOrders: (state, action: PayloadAction<IOrder[]>) => {
      state.orders = action.payload;
    },

    //set current order
    setCurrentOrder: (state, action: PayloadAction<IOrder>) => {
      state.currentOrder = action.payload;
    },
  },
});

export const { setOrders, setCurrentOrder } = orderSlice.actions;
export default orderSlice;
