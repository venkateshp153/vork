// redux/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../services/authService';
import type { RootState } from '../store/store';

// Type Definitions
export interface UserData {
  id: string;
  Email: string;
  Username?: string;
  Company?: string;
  AccessCode?: string;
  [key: string]: any; // For unexpected fields
}

export interface AuthState {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  resetToken: string | null;
  isAuthenticated: boolean;
  resetLoading: boolean;
  sessionChecked: boolean; // New field to track if initial session check was done
}

// Error handling type
type ErrorWithMessage = {
  message: string;
};

// Payload Types
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  id: string;
  company: string;
}

interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  resetToken: null,
  isAuthenticated: false,
  resetLoading: false,
  sessionChecked: false,
};

export const login = createAsyncThunk<
  UserData,
  LoginCredentials,
  { rejectValue: ErrorWithMessage }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const user = await authService.login(credentials.email, credentials.password);
    return user;
  } catch (error) {
    let errorMessage = 'Login failed';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    return rejectWithValue({ message: errorMessage });
  }
});

export const register = createAsyncThunk<
  UserData,
  RegisterData,
  { rejectValue: ErrorWithMessage }
>('auth/register', async (userData, { rejectWithValue }) => {
  try {
    // Validate password match
    if (userData.password !== userData.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const user = await authService.register({
      Username: userData.username,
      Email: userData.email,
      Password: userData.password,
      Id: userData.id,
      Company: userData.company,
    });
    return user;
  } catch (error) {
    let errorMessage = 'Registration failed';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return rejectWithValue({ message: errorMessage });
  }
});

export const requestPasswordReset = createAsyncThunk<
  string,
  string,
  { rejectValue: ErrorWithMessage }
>('auth/requestPasswordReset', async (email, { rejectWithValue }) => {
  try {
    const { token } = await authService.requestPasswordReset(email);
    return token;
  } catch (error) {
    let errorMessage = 'Password reset request failed';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return rejectWithValue({ message: errorMessage });
  }
});

export const resetPassword = createAsyncThunk<
  void,
  ResetPasswordPayload,
  { rejectValue: ErrorWithMessage }
>('auth/resetPassword', async (payload, { rejectWithValue }) => {
  try {
    await authService.resetPassword(payload.token, payload.newPassword);
  } catch (error) {
    let errorMessage = 'Password reset failed';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return rejectWithValue({ message: errorMessage });
  }
});

export const validateSession = createAsyncThunk<
  UserData | null,
  string | undefined,
  { rejectValue: ErrorWithMessage }
>('auth/validateSession', async (accessCode, { rejectWithValue }) => {
  try {
    if (!accessCode) {
      return null;
    }
    const user = await authService.validateSession(accessCode);
    return user;
  } catch (error) {
    let errorMessage = 'Session validation failed';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return rejectWithValue({ message: errorMessage });
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.resetToken = null;
      state.error = null;
    },
    setUser: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearResetToken: (state) => {
      state.resetToken = null;
    },
    setSessionChecked: (state, action: PayloadAction<boolean>) => {
      state.sessionChecked = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Registration failed';
      })

      // Password Reset
      .addCase(requestPasswordReset.pending, (state) => {
        state.resetLoading = true;
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state, action) => {
        state.resetLoading = false;
        state.resetToken = action.payload;
        state.error = null;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.resetLoading = false;
        state.error = action.payload?.message || 'Password reset request failed';
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.resetToken = null;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Password reset failed';
      })

      // Session Validation
      .addCase(validateSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateSession.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.sessionChecked = true;
        state.error = null;
      })
      .addCase(validateSession.rejected, (state, action) => {
        state.loading = false;
        state.sessionChecked = true;
        state.error = action.payload?.message || 'Session validation failed';
      });
  },
});

// Action creators
export const { 
  logout, 
  setUser, 
  clearError, 
  clearResetToken,
  setSessionChecked 
} = authSlice.actions;

// Selectors
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectResetToken = (state: RootState) => state.auth.resetToken;
export const selectResetLoading = (state: RootState) => state.auth.resetLoading;
export const selectSessionChecked = (state: RootState) => state.auth.sessionChecked;

// Reducer
export default authSlice.reducer;