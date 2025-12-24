import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import contentSectionsReducer from "./contentSectionsSlice";
import systemSettingsReducer from "./systemSettingsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    contentSections: contentSectionsReducer,
    systemSettings: systemSettingsReducer
  },
});
