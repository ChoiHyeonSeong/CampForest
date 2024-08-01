import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type RegistState = {
  userName: string,
  userBirthdate: string | null | undefined,
  userGender: string,
  phoneNumber: string,
  userEmail: string,
  userPassword: string,
  profileImage: string | null,
  nickname: string,
  introduction: string,
  interests: object | null
}

type RegistRequiredPayload = {
  userName: string,
  userBirthdate: string | null | undefined,
  userGender: string,
  phoneNumber: string,
  userEmail: string,
  userPassword: string
}

type RegistOptionalPayload = {
  profileImage: string | null,
  nickname: string,
  introduction: string,
  interests: object | null
}

const Regist: RegistState = {
  userName: '',
  userBirthdate: '',
  userGender: '',
  phoneNumber: '',
  userEmail: '',
  userPassword: '',
  profileImage: null,
  nickname: '',
  introduction: '',
  interests: null,
};

const registSlice = createSlice({
  name: 'registStore',
  initialState: Regist,
  reducers: {
    registRequired: (state, action: PayloadAction<RegistRequiredPayload>) => {
      state.userName = action.payload.userName;
      state.userBirthdate = action.payload.userBirthdate;
      state.userGender = action.payload.userGender;
      state.phoneNumber = action.payload.phoneNumber;
      state.userEmail = action.payload.userEmail;
      state.userPassword = action.payload.userPassword;
    },
    registOptional: (state, action: PayloadAction<RegistOptionalPayload>) => {
      state.profileImage = action.payload.profileImage;
      state.nickname = action.payload.nickname;
      state.introduction = action.payload.introduction;
      state.interests = action.payload.interests;
    },
    registClear: (state) => {
      state.userName = '';
      state.userBirthdate = null;
      state.userGender = '';
      state.phoneNumber = '';
      state.userEmail = '';
      state.userPassword = '';
      state.profileImage = null;
      state.nickname = '';
      state.introduction = '';
      state.interests = null;
    },
  },
});

export const { registRequired, registOptional, registClear } = registSlice.actions;
export default registSlice.reducer;