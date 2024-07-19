import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import registReducer from './registSlice';

export const store = configureStore({
  reducer: {
    authStore: authReducer,
    registStore: registReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;