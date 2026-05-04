import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { postApi } from '../../../api/apiClient';

interface SessionState {
  loading: boolean;
  error: string | null;
  data: any | null;
  allSessions: any[];
}

const initialState: SessionState = {
  loading: false,
  error: null,
  data: null,
  allSessions: [],
};

export const createSession = createAsyncThunk(
  'session/createSession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await postApi('api/v1/Sessions');
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to create session');
    }
  }
);

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(createSession.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || 'Failed to create session';
      });
  },
});

export default sessionSlice.reducer;
