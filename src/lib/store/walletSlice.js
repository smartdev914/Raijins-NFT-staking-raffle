import { createSlice } from "@reduxjs/toolkit";

export const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    isWalletConnected: false,
  },
  reducers: {
    toggleConnect: (state) => {
      state.isWalletConnected = !state.isWalletConnected;
    },
  },
});

export const { toggleConnect } = walletSlice.actions;

export default walletSlice.reducer;
