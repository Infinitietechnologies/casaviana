import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import contentSectionsReducer from "./contentSectionsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    contentSections: contentSectionsReducer,
  },
});
