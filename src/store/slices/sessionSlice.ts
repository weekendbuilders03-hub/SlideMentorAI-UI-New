import { createSlice } from '@reduxjs/toolkit';
import type { DeckSession } from '../../types/deck';

interface SessionState {
  current: DeckSession | null;
  loading: boolean;
  error: string | null;
}

const initialState: SessionState = {
  current: null,
  loading: false,
  error: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession: (state, action: { payload: DeckSession }) => {
      state.current = action.payload;
      state.error = null;
    },
    clearSession: (state) => {
      state.current = null;
      state.error = null;
    },
    setSessionLoading: (state, action: { payload: boolean }) => {
      state.loading = action.payload;
    },
    setSessionError: (state, action: { payload: string }) => {
      state.error = action.payload;
      state.loading = false;
    },
    advancePhase: (state) => {
      if (state.current && state.current.currentPhase < 4) {
        state.current.currentPhase = (state.current.currentPhase + 1) as 1 | 2 | 3 | 4;
      }
    },
    setAudience: (state, action: { payload: string }) => {
      if (state.current) {
        state.current.audience = action.payload;
      }
    },
    setTimeMinutes: (state, action: { payload: number }) => {
      if (state.current) {
        state.current.timeMinutes = action.payload;
      }
    },
  },
});

export const {
  setSession,
  clearSession,
  setSessionLoading,
  setSessionError,
  advancePhase,
  setAudience,
  setTimeMinutes,
} = sessionSlice.actions;

export default sessionSlice.reducer;
