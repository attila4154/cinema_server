import { UserInfo } from "@/db/schema";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

// todo: better type? (union)
export type AuthState = {
  loggedIn: boolean;
  user: UserInfo | null;
};

const initialState: AuthState = {
  loggedIn: false,
  user: null,
};


export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.loggedIn = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.loggedIn = false;
    },
  },
});

export const authActions = authSlice.actions;
export const selectAuthState = (state: RootState) =>
  state.auth;
