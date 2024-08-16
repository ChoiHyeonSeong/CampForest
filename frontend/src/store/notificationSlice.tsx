import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type NotificationType = {
  createdAt: string;
  message: string;
  notificationId: number;
  notificationType: string;
  read: boolean;
  senderId: number;
  senderNickname: string;
  senderProfileImage: string;
};

type NotificationState = {
  notificationList: NotificationType[];
  newNotificationList: NotificationType[];
}

const initialState: NotificationState = {
  notificationList: [],
  newNotificationList: [],
};

const notificationSlice = createSlice({
  name: 'notificationStore',
  initialState,
  reducers: {
    setNotificationList: (state, action: PayloadAction<NotificationType[]>) => {
      state.notificationList = action.payload.filter(notification => notification.read);
      state.newNotificationList = action.payload.filter(notification => !notification.read);
    },
    addNewNotification: (state, action: PayloadAction<NotificationType>) => {
      state.newNotificationList.push(action.payload);
    },
    updateNotificationList: (state) => {
      state.notificationList = [...state.notificationList, ...state.newNotificationList];
      state.newNotificationList = [];
    }
  }
})

export const {
  setNotificationList,
  addNewNotification,
  updateNotificationList,
} = notificationSlice.actions;

export default notificationSlice.reducer;