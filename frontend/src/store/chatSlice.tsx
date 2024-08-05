import { Message } from '@components/Chat/Chat';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ChatState = {
  selectedCategory: string;
  roomId: number;
  roomIds: number[];
  chatInProgress: Message[];
}

const initialState: ChatState = {
  selectedCategory: '',
  roomId: 0,
  roomIds: [],
  chatInProgress: [],
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
    setRoomId: (state, action: PayloadAction<number>) => {
      state.roomId = action.payload;
    },
    setRoomIds: (state, action: PayloadAction<number[]>) => {
      state.roomIds = action.payload;
    },
    setChatInProgress: (state, action: PayloadAction<Message[]>) => {
      state.chatInProgress = action.payload;
    }
  }
})

export const {selectCommnunity, selectTransaction, setRoomId, setRoomIds, setChatInProgress } = chatSlice.actions;
export default chatSlice.reducer;