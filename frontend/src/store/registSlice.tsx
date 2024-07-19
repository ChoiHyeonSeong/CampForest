import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type RegistState = {
  userName: string | null,
  userBirthdate: Date | null,
  userGender: string | null,
  phoneNumber: string | null,
  userEmail: string | null,
  userPassword: string | null,
  profileImage: string | null,
  nickname: string | null,
  introduction: string | null,
  interests: boolean[] | null
}

type RegistRequiredPayload = {
  userName: string,
  userBirthdate: Date,
  userGender: string,
  phoneNumber: string,
  userEmail: string,
  userPassword: string
}

type RegistOptionalPayload = {
  profileImage: string | null,
  nickname: string | null,
  introduction: string | null,
  interests: boolean[]
}

const Regist: RegistState = {
  userName: null,
  userBirthdate: null,
  userGender: null,
  phoneNumber: null,
  userEmail: null,
  userPassword: null,
  profileImage: null,
  nickname: null,
  introduction: null,
  interests: null
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
      state.userName = null;
      state.userBirthdate = null;
      state.userGender = null;
      state.phoneNumber = null;
      state.userEmail = null;
      state.userPassword = null;
      state.profileImage = null;
      state.nickname = null;
      state.introduction = null;
      state.interests = null;
    },
  },
});

export const { registRequired, registOptional } = registSlice.actions;
export default registSlice.reducer;