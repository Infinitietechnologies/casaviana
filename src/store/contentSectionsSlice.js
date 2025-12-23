import { createSlice } from "@reduxjs/toolkit";

const contentSectionsSlice = createSlice({
  name: "contentSections",
  initialState: {
    sections: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSections: (state, action) => {
      state.sections = action.payload;
      state.loading = false;
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

export const { setSections, setLoading, setError } = contentSectionsSlice.actions;
export default contentSectionsSlice.reducer;
