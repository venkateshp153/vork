import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Initial state
const initialState = {
  user: null,  // Store user data when logged in
  accessKey: null,  // Store access key
  loading: false,
  error: null,
};

// Async thunk to load user and accessKey from AsyncStorage
export const loadUserFromStorage = createAsyncThunk(
  "auth/loadUserFromStorage",
  async () => {
    const user = await AsyncStorage.getItem("user");
    const accessKey = await AsyncStorage.getItem("accessKey");
    return { user: user ? JSON.parse(user) : null, accessKey };
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { user, accessKey } = action.payload; // Extract user and accessKey from payload
      state.user = user;  // Store user data
      state.accessKey = accessKey;  // Store access key
      AsyncStorage.setItem("user", JSON.stringify(user)); // Persist user
      AsyncStorage.setItem("accessKey", accessKey); // Persist accessKey
    },
    logout: (state) => {
      state.user = null;
      state.accessKey = null;
      AsyncStorage.removeItem("user"); // Clear stored user
      AsyncStorage.removeItem("accessKey"); // Clear stored accessKey
    },
    setUser: (state, action) => {
      const { user, accessKey } = action.payload; // Restore user and accessKey
      state.user = user;
      state.accessKey = accessKey;
    },
  },
  extraReducers: (builder) => {
    // Handle async user loading
    builder
      .addCase(loadUserFromStorage.pending, (state) => {
        state.loading = true;  // Set loading to true while fetching the user
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false once the user is loaded
        const { user, accessKey } = action.payload;
        state.user = user; // Store the loaded user
        state.accessKey = accessKey; // Store the loaded accessKey
      })
      .addCase(loadUserFromStorage.rejected, (state, action) => {
        state.loading = false; // Set loading to false if the operation fails
        state.error = action.error.message; // Store the error message if any
      });
  },
});

export const { login, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
