import {
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
import { authSlice } from "./auth";

// todo: init value from cookie
const reducer = combineReducers({
  auth: authSlice.reducer,
});

export const makeStore = () => {
  console.log("making store");
  return configureStore({
    reducer,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
