import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserState = {
  userId: number,
  nickname: string,
  profileImage: string,
  isLoggedIn: boolean
}

const initialState: UserState = {
  userId: 0,
  nickname: '',
  profileImage: '',
  isLoggedIn: false
}

const userSlice = createSlice({
  name: 'userStore',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ userId: number; nickname: string; profileImage: string}>) => {
      state.userId = action.payload.userId;
      state.nickname = action.payload.nickname;
      state.profileImage = action.payload.profileImage;
      state.isLoggedIn = true;
    },
    clearUser: (state) => {
      state.profileImage = '';
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;