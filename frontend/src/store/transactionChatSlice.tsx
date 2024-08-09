import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TransactionChatType = {
}

type TransactionChatState = {

}

const initialState: TransactionChatState = {
};

const transactionChatSlice = createSlice({
  name: 'transactionChatStore',
  initialState,
  reducers: {
   
  }
})

export const {
} = transactionChatSlice.actions;
export default transactionChatSlice.reducer;