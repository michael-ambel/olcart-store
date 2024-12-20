import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../types/userTypes";

interface UserState {
  user: IUser | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    //..set user
    setUser(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
    },

    //..clear user
    clearUser(state) {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice;
