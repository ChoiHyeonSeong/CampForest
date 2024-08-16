import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ReviewState = {
  productImgUrl: string;
  productType: string;
  productName: string;
  price: number;
  deposit: number;
  opponentId: number;
  opponentNickname: string;
  roomId: number;
}

const initialState: ReviewState = {
  productImgUrl: '',
  productType: '',
  productName: '',
  price: 0,
  deposit: 0,
  opponentId: 0,
  opponentNickname: '',
  roomId: 0,
}

const reviewSlice = createSlice({
  name: 'reviewStore',
  initialState,
  reducers: {
    setOpponentInfo: (state, action: PayloadAction<{opponentId: number, opponentNickname: string}>) => {
      state.opponentId = action.payload.opponentId;
      state.opponentNickname = action.payload.opponentNickname;
    },
    setTransactionInfo: (state, action: PayloadAction<{
      productImgUrl: string, productType: string, productName: string, price: number, deposit: number, roomId: number}>) => {
        state.productImgUrl = action.payload.productImgUrl;
        state.productType = action.payload.productType;
        state.productName = action.payload.productName;
        state.price = action.payload.price;
        state.deposit = action.payload.deposit;
        state.roomId = action.payload.roomId;
    },
    setReviewState: (state, action: PayloadAction<ReviewState>) => {
      state = action.payload;
    }
  }
})

export const {
  setOpponentInfo,
  setTransactionInfo,
  setReviewState
} = reviewSlice.actions;

export default reviewSlice.reducer;