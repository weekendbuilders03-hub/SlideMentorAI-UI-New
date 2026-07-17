import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authService } from '../../api/services/authService';
import type { AuthState, LoginCredentials, SignupCredentials } from '../../types/auth';

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  loading: false,
  error: null,
  user: null,
};

export const loginWithCredentials = createAsyncThunk(
  'auth/loginWithCredentials',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      sessionStorage.setItem('token', response.token);
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue('Login failed');
    }
  },
);

export const signupWithCredentials = createAsyncThunk(
  'auth/signupWithCredentials',
  async (credentials: SignupCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.signup(credentials);
      sessionStorage.setItem('token', response.token);
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue('Signup failed');
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithCredentials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithCredentials.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginWithCredentials.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Login failed';
      })
      .addCase(signupWithCredentials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupWithCredentials.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(signupWithCredentials.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Signup failed';
      });
  },
});

export const { logout, initializeAuth, clearError } = authSlice.actions;
export default authSlice.reducer;
