import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserData = {
  userId: number,
  userName: string,
  email: string,
  role: string,
  birthdate: string,
  gender: string,
  nickname: string,
  phoneNumber: string,
  introduction: string,
  profileImage: string,
  createdAt: string,
  modifiedAt: string,
  open: boolean
}

type AuthState = {
  isLoggedIn: boolean;
  userData: UserData | null;
  token: string | null;
}

type AuthPayload = {
  userData: UserData;
  token: string;
}

const Auth: AuthState = {
  isLoggedIn: false,
  userData: null,
  token: null,
};

const authSlice = createSlice({
  name: 'authStore',
  initialState: Auth,
  reducers: {
    login: (state, action: PayloadAction<AuthPayload>) => {
      state.isLoggedIn = true;
      state.userData = action.payload.userData;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userData = null;
      state.token = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;