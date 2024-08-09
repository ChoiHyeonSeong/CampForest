import { Message } from '@components/Chat/Chat';
import { ChatUserType } from '@components/Chat/ChatUser';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ChatState = {
  isChatOpen: boolean;
  selectedCategory: string;
  roomId: number;
  roomIds: number[];
  chatInProgress: Message[];
  otherId: number;
  communityChatUserList: ChatUserType[];
  transactionChatUserList: ChatUserType[];
  totalUnreadCount: number;
}

const initialState: ChatState = {
  isChatOpen: false,
  selectedCategory: '일반',
  roomId: 0,
  roomIds: [],
  chatInProgress: [],
  otherId: 0,
  communityChatUserList: [],
  transactionChatUserList: [],
  totalUnreadCount: 0,
};

const chatSlice = createSlice({
  name: 'chatStore',
  initialState,
  reducers: {
    setIsChatOpen: (state, action: PayloadAction<boolean>) => {
      state.isChatOpen = action.payload;
      if(!action.payload) {
        state.roomId = 0;
      }
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
    addMessageToChatInProgress: (state, action: PayloadAction<Message>) => {
      state.chatInProgress.push(action.payload);
    },
    setOtherId: (state, action: PayloadAction<number>) => {
      state.otherId = action.payload;
    },
    setCommunityChatUserList: (state, action: PayloadAction<ChatUserType[]>) => {
      state.communityChatUserList = action.payload;
    },
    updateCommunityChatUserList: (state, action: PayloadAction<{roomId: number; content: string; createdAt: string; inProgress: boolean}>) => {
      let totalUnreadCountDiff = 0;
    
      state.communityChatUserList = state.communityChatUserList.map(chatRoom => {
        if (chatRoom.roomId === action.payload.roomId) {
          const newUnreadCount = action.payload.inProgress ? 0 : chatRoom.unreadCount + 1;
          
          if (action.payload.inProgress) {
            totalUnreadCountDiff -= chatRoom.unreadCount;
          } else {
            totalUnreadCountDiff += 1;
          }
    
          return { 
            ...chatRoom, 
            createdAt: action.payload.createdAt, 
            unreadCount: newUnreadCount, 
            lastMessage: action.payload.content 
          };
        }
        return chatRoom;
      });
    
      // totalUnreadCount 업데이트
      state.totalUnreadCount += totalUnreadCountDiff;
    },
    updateMessageReadStatus: (state, action: PayloadAction<{ roomId: number, readerId: number }>) => {
      state.chatInProgress = state.chatInProgress.map(message => 
        message.roomId === action.payload.roomId && message.senderId !== action.payload.readerId
          ? { ...message, read: true }
          : message
      );
    },
    setTotalUnreadCount: (state, action: PayloadAction<number>) => {
      state.totalUnreadCount = action.payload;
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
  addMessageToChatInProgress,
  setOtherId,
  setCommunityChatUserList,
  updateCommunityChatUserList,
  updateMessageReadStatus,
  setTotalUnreadCount
} = chatSlice.actions;
export default chatSlice.reducer;