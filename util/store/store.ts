import { configureStore } from "@reduxjs/toolkit";

import backdrop from "./slice/backdropSlice";

export const store = configureStore({
  reducer: {
    backdrop,
  },
});
