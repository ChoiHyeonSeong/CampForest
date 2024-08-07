import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import registReducer from './registSlice';
import modalReducer from './modalSlice';
import themeReducer from './themeSlice';
import chatReducer from './chatSlice';
import profileReducer from './profileSlice';

export const store = configureStore({
  reducer: {
    userStore: userReducer,
    registStore: registReducer,
    modalStore: modalReducer,
    themeStore: themeReducer,
    chatStore: chatReducer,
    profileStore: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;