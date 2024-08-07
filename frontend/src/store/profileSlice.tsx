import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ProfileState = {
  boardCount: number;
  productCount: number;
  reviewCount: number;
}

const initialState: ProfileState = {
  boardCount: 0,
  productCount: 0,
  reviewCount: 0,
}

const profileSlice = createSlice({
  name: 'profileStore',
  initialState,
  reducers: {
    setBoardCount: (state, action: PayloadAction<number>) => {
      state.boardCount = action.payload;
    },
    setProductCount: (state, action: PayloadAction<number>) => {
      state.productCount = action.payload;
    },
    setReviewCount: (state, action: PayloadAction<number>) => {
      state.reviewCount = action.payload;
    },
  }
});

export const { setBoardCount, setProductCount, setReviewCount } = profileSlice.actions
export default profileSlice.reducer;

