import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authReducer from "./reducres/authReducer"; // Adjust path to your actual rootReducer

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth"], // Only persist the 'auth' reducer (you can add others here as needed)
};

const persistedReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore certain actions to avoid the serializableCheck warning
        ignoredActions: ["persist/PERSIST"], 
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
