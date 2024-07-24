import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import registReducer from './registSlice';
import modalReducer from './modalSlice';

export const store = configureStore({
  reducer: {
    authStore: authReducer,
    registStore: registReducer,
    modalStore: modalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;