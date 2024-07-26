import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  userName: string | null;
  profileImage: string | undefined;
};

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  userName: null,
  profileImage: undefined,
};

const authSlice = createSlice({
  name: 'authStore',
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    setRefreshToken(state, action: PayloadAction<string>) {
      state.refreshToken = action.payload;
    },
    clearToken(state) {
      state.accessToken = null;
      state.userName = null;
      state.profileImage = undefined;
    },
    setUserName(state, action: PayloadAction<string>) {
      state.userName = action.payload;
    },
    setProfileImage(state, action: PayloadAction<string>) {
      state.profileImage = action.payload;
    },
  },
});

export const { setAccessToken, setRefreshToken, clearToken, setUserName, setProfileImage } =
  authSlice.actions;
export default authSlice.reducer;
