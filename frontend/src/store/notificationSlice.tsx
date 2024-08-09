import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type NotificationType = {
};

const initialState: NotificationType = {
};

const notificationSlice = createSlice({
  name: 'notificationStore',
  initialState,
  reducers: {
    
  }
})

export const {
  
} = notificationSlice.actions;
export default notificationSlice.reducer;