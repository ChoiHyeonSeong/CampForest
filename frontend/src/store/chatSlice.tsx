import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ChatState = {
  selectedCategory: string;
  otherUserId: number;
}

const initialState: ChatState = {
  selectedCategory: '일반',
  otherUserId: 0,
};

const chatSlice = createSlice({
  name: 'chatStore',
  initialState,
  reducers: {
    selectCommnunity: (state) => {
      state.selectedCategory = '일반';
    },
    selectTransaction: (state) => {
      state.selectedCategory = '거래';
    },
    setOtherUserId: (state, action: PayloadAction<number>) => {
      state.otherUserId = action.payload;
    }
  }
})

export const {selectCommnunity, selectTransaction, setOtherUserId} = chatSlice.actions;
export default chatSlice.reducer;