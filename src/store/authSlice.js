import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    user: null,
  },
  reducers: {
    setLogin: (state, action) => {
      state.isLoggedIn = true;
      const payload = action.payload || {};
      state.user = payload.user ?? payload.data?.user ?? payload;
    },
    updateProfile: (state, action) => {
      const payload = action.payload || {};
      state.user = payload.user ?? payload.data?.user ?? payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

export const { setLogin, updateProfile, logout } = authSlice.actions;
export default authSlice.reducer;
