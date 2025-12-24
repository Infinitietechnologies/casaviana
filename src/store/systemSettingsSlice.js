import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  settings: null,
  loading: false,
  error: null,
  lastFetched: null,
};

const systemSettingsSlice = createSlice({
  name: "systemSettings",
  initialState,
  reducers: {
    setSettings: (state, action) => {
      state.settings = action.payload;
      state.lastFetched = Date.now();
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setSettings, setLoading, setError } = systemSettingsSlice.actions;
export default systemSettingsSlice.reducer;