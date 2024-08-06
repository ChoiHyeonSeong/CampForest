import { Message } from '@components/Chat/Chat';
import { ChatUserType } from '@components/Chat/ChatUser';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ChatState = {
  isChatOpen: boolean;
  selectedCategory: string;
  roomId: number;
  roomIds: number[];
  chatInProgress: Message[];
  communityChatUserList: ChatUserType[];
}

const initialState: ChatState = {
  isChatOpen: false,
  selectedCategory: '',
  roomId: 0,
  roomIds: [],
  chatInProgress: [],
  communityChatUserList: [],
};

const chatSlice = createSlice({
  name: 'chatStore',
  initialState,
  reducers: {
    setIsChatOpen: (state, action: PayloadAction<boolean>) => {
      state.isChatOpen = action.payload;
    },
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
    },
    setCommunityChatUserList: (state, action: PayloadAction<ChatUserType[]>) => {
      state.communityChatUserList = action.payload;
    },
    updateCommunityChatUserList: (state, action: PayloadAction<{roomId: number; content: string; createdAt: string; inProgress: boolean}>) => {
      state.communityChatUserList = state.communityChatUserList.map(chatRoom =>
        chatRoom.roomId === action.payload.roomId
          ? { ...chatRoom, createdAt: action.payload.createdAt, unreadCount: action.payload.inProgress ? 0 : chatRoom.unreadCount + 1, lastMessage: action.payload.content }
          : chatRoom
      );
    },
    updateMessageReadStatus: (state, action: PayloadAction<{ roomId: number, readerId: number }>) => {
      state.chatInProgress = state.chatInProgress.map(message => 
        message.roomId === action.payload.roomId && message.senderId !== action.payload.readerId
          ? { ...message, read: true }
          : message
      );
    },
  }
})

export const {
  setIsChatOpen, 
  selectCommnunity, 
  selectTransaction, 
  setRoomId, 
  setRoomIds, 
  setChatInProgress,
  setCommunityChatUserList,
  updateCommunityChatUserList,
  updateMessageReadStatus,
} = chatSlice.actions;
export default chatSlice.reducer;