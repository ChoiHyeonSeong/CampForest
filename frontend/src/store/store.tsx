import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import registReducer from './registSlice';
import modalReducer from './modalSlice';
import themeReducer from './themeSlice';
import chatReducer from './chatSlice';
import notificationReducer from './notificationSlice';
import transactionChatReducer from './transactionChatSlice';

export const store = configureStore({
  reducer: {
    userStore: userReducer,
    registStore: registReducer,
    modalStore: modalReducer,
    themeStore: themeReducer,
    chatStore: chatReducer,
    notificationStore: notificationReducer,
    transactionChatStore: transactionChatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;