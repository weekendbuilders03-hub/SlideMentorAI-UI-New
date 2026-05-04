import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth';
import sessionReducer from './features/session';
import uploadReducer from './features/upload';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    session: sessionReducer,
    upload: uploadReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
