import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
  isLoggedIn: boolean;
  user: string | null;
  key: string | null;
}

type AuthPayload = {
  user: string;
  key: string;
}

const Auth: AuthState = {
  isLoggedIn: false,
  user: null,
  key: null,
};

const authSlice = createSlice({
  name: 'authStore',
  initialState: Auth,
  reducers: {
    login: (state, action: PayloadAction<AuthPayload>) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.key = action.payload.key;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.key = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;