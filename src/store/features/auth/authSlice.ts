import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { postApi, getApi } from '../../../api/apiClient';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
  user: any | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  loading: false,
  error: null,
  user: null,
};

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (idToken: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await postApi<{ token: string }>(
        "Auth/google",
        {
          idToken: idToken,
        }
      );

      const { token } = response.data;

      // Store token in sessionStorage
      sessionStorage.setItem("token", token);

      // Automatically fetch current user after successful login
      dispatch(fetchCurrentUser());

      return token;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Login failed');
    }
  }
);


export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getApi<any>('api/v1/User/me');
      // Extract user data from nested response structure
      return response.data.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch user profile');
    }
  }
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
      // Clear token from sessionStorage
      sessionStorage.removeItem('token');
      console.log('Logged out');
    },
    initializeAuth: (state) => {
      const token = sessionStorage.getItem('token');
      if (token) {
        state.isAuthenticated = true;
        state.token = token;
        state.loading = false;
        state.error = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload;
        state.error = null;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || 'Login failed';
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || 'Failed to fetch user profile';
      });
  },
});

export const { logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
