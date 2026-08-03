import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authService } from '../../api/services/authService';
import { extractApiError } from '../../api/axios';
import type { AuthState, GoogleAuthCredentials } from '../../types/auth';

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  loading: false,
  error: null,
  user: null,
};

/**
 * Authenticate with Google OAuth.
 * Handles both new sign-ups and returning logins.
 */
export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (credentials: GoogleAuthCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.googleAuth(credentials);
      sessionStorage.setItem('token', response.token);
      return response;
    } catch (error: unknown) {
      return rejectWithValue(extractApiError(error));
    }
  },
);

/**
 * Fetch the current authenticated user's profile.
 * Called after initializeAuth restores a token from sessionStorage,
 * so the user object is populated even after a page refresh.
 */
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getMe();
    } catch (error: unknown) {
      return rejectWithValue(extractApiError(error));
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.loading = false;
      state.error = null;
      state.user = null;
      sessionStorage.removeItem('token');
    },
    initializeAuth: (state) => {
      const token = sessionStorage.getItem('token');
      if (token) {
        state.isAuthenticated = true;
        state.token = token;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    setError: (state, action: { payload: string }) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ── loginWithGoogle ── */
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Google login failed';
      })
      /* ── fetchCurrentUser ── */
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Failed to load user';
      });
  },
});

export const { logout, initializeAuth, clearError, setError } = authSlice.actions;
export default authSlice.reducer;
