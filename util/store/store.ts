import { configureStore } from "@reduxjs/toolkit";

import backdrop from "./slice/backdropSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    backdrop,
  },
});

export type AppStoreState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<AppStoreState> = useSelector;
