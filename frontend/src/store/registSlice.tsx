import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type RegistState = {
  required: RegistRequiredPayload,
  optional: RegistOptionalPayload
}

type RegistRequiredPayload = {
  userName: string,
  phoneNumber: string,
  userEmail: string,
  userPassword: string
}

type RegistOptionalPayload = {
  profileImage: string | null,
  nickname: string,
  userBirthdate: string | null | undefined,
  userGender: string,
  introduction: string,
  interests: string[] | null
}

const Regist: RegistState = {
  required: {
    userName: '',
    phoneNumber: '',
    userEmail: '',
    userPassword: '',
  },
  optional: {
    profileImage: null,
    nickname: '',
    userBirthdate: '',
    userGender: '',
    introduction: '',
    interests: []
  }
};

const registSlice = createSlice({
  name: 'registStore',
  initialState: Regist,
  reducers: {
    registRequired: (state, action: PayloadAction<RegistRequiredPayload>) => {
      state.required.userName = action.payload.userName;
      state.required.phoneNumber = action.payload.phoneNumber;
      state.required.userEmail = action.payload.userEmail;
      state.required.userPassword = action.payload.userPassword;
    },
    registOptional: (state, action: PayloadAction<RegistOptionalPayload>) => {
      state.optional.profileImage = action.payload.profileImage;
      state.optional.nickname = action.payload.nickname;
      state.optional.userBirthdate = action.payload.userBirthdate;
      state.optional.userGender = action.payload.userGender;
      state.optional.introduction = action.payload.introduction;
      state.optional.interests = action.payload.interests;
    },
    registClear: (state) => {
      state.required.userName = '';
      state.optional.userBirthdate = '';
      state.optional.userGender = '';
      state.required.phoneNumber = '';
      state.required.userEmail = '';
      state.required.userPassword = '';
      state.optional.profileImage = null;
      state.optional.nickname = '';
      state.optional.introduction = '';
      state.optional.interests = [];
    },
  },
});

export const { registRequired, registOptional, registClear } = registSlice.actions;
export default registSlice.reducer;