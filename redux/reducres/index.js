import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";  // Default storage for React Native (AsyncStorage)

// Import your reducers here (create them if missing)
import authReducer from "./authReducer";    

// Define the persist configuration for the root reducer
const persistConfig = {
  key: "root",           // Key for the root state in the persisted storage
  storage,               // Storage type (localStorage/AsyncStorage)
  whitelist: ["auth"],   // List of reducers to persist (auth in this case)
};

// Combine all your reducers
const rootReducer = combineReducers({
  auth: authReducer,    // You can add more reducers here as needed
});

// Apply persistReducer to make sure the auth reducer is persisted
const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
