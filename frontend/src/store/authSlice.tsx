import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
  token: string | null;
  refreshToken: string | null;
  userName: string | null;
  profileImage: string | undefined;
}

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  userName: null,
  profileImage: undefined,
};

const authSlice = createSlice({
  name: 'authStore',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    setRefreshToken(state, action: PayloadAction<string>) {
      state.refreshToken = action.payload;
    },
    clearToken(state) {
      state.token = null;
      state.userName = null;
      state.profileImage = undefined;
    },
    setUserName(state, action: PayloadAction<string>) {
      state.userName =  action.payload;
    },
    setProfileImage(state, action: PayloadAction<string>) {
      state.profileImage = action.payload;
    }
  },
});

export const { setToken, setRefreshToken, clearToken, setUserName, setProfileImage } = authSlice.actions;
export default authSlice.reducer;