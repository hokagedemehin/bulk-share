import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
};

export const backdropSlice = createSlice({
  name: "backdrop",
  initialState,
  reducers: {
    setOpenBackdrop: (state) => {
      state.open = true;
    },
    setCloseBackdrop: (state) => {
      state.open = false;
    },
  },
});

export const { setOpenBackdrop, setCloseBackdrop } = backdropSlice.actions;

export default backdropSlice.reducer;
