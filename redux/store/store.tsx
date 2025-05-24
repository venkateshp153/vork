// redux/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer, { AuthState } from '../slices/authSlice';

// Define root state type
export interface RootState {
  auth: AuthState;
  // Add other state types here as you add more reducers
}

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['auth'], // Only persist the auth slice
  // Optional migration if state structure changes in future
  migrate: (state: any) => {
    if (!state || !state._persist || state._persist.version !== 1) {
      // Handle migration if needed
      return Promise.resolve(state);
    }
    return Promise.resolve(state);
  },
  // Optional transforms to filter persisted data
  transforms: [
    // You can add transforms here if needed
  ],
  // Optional debug mode
  debug: process.env.NODE_ENV !== 'production',
};

const persistedReducer = persistReducer<AuthState>(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
    // Add other reducers here when needed
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Optional: Ignore specific paths in state if needed
        ignoredPaths: ['auth.resetToken'], // Example if you have non-serializable data
      },
      // Add other middleware options if needed
      immutableCheck: process.env.NODE_ENV !== 'production',
    }),
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
  // Optional enhancers
  // enhancers: (defaultEnhancers) => [...defaultEnhancers],
});

export const persistor = persistStore(store, {
  // Optional persistence callbacks
  // manualPersist: false,
});

// Enhanced type definitions
export type AppDispatch = typeof store.dispatch;
export type AppThunkAPI = {
  dispatch: AppDispatch;
  state: RootState;
  // Add extra types if needed
};

// Optional: Add store persistor purge function for development
if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  (window as any).purgeStore = () => persistor.purge();
}