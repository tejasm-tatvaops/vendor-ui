import { configureStore } from "@reduxjs/toolkit";
import vendorProfileReducer from "./vendorProfileSlice";

export const store = configureStore({
  reducer: {
    vendorProfile: vendorProfileReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
