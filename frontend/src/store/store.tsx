import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import registReducer from './registSlice';
import modalReducer from './modalSlice';

export const store = configureStore({
  reducer: {
    userStore: userReducer,
    registStore: registReducer,
    modalStore: modalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;