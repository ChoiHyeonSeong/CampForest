import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import registReducer from './registSlice';
import modalReducer from './modalSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    userStore: userReducer,
    registStore: registReducer,
    modalStore: modalReducer,
    themeStore: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;