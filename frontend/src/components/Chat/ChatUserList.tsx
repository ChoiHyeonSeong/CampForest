import React, { useEffect, useState } from 'react';
import ChatUser, { ChatUserType } from './ChatUser';
import Chat from './Chat';
import { RootState, store } from '@store/store';
import { useDispatch, useSelector } from 'react-redux';
import { setChatInProgress, setIsChatOpen, setRoomId, updateCommunityChatUserList } from '@store/chatSlice';
import { useWebSocket } from 'Context/WebSocketContext';
import { communityChatDetail } from '@services/communityChatService';

type Props = {
  isLogin: boolean;
  userId: number;
}

const ChatUserList = (props: Props) => {
  const { markRead } = useWebSocket();
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.userStore.userId);
  const isChatOpen = useSelector((state: RootState) => state.chatStore.isChatOpen);
  const storedRoomId = useSelector((state: RootState) => state.chatStore.roomId);
  const communityChatUserList = useSelector((state: RootState) => state.chatStore.communityChatUserList);
  const [otherId, setOtherId] = useState(0);

  const handleChatUser = async (communityChatUser: ChatUserType) => {
    if(communityChatUser.roomId !== storedRoomId) {
      dispatch(setChatInProgress([]));
      dispatch(setRoomId(communityChatUser.roomId));
    }
    
    setOtherId(communityChatUser.otherUserId);
    markRead(`/pub/room/${communityChatUser.roomId}/markAsRead`, userId );
    dispatch(updateCommunityChatUserList({
      roomId: communityChatUser.roomId,
      content: communityChatUser.lastMessage,
      createdAt: communityChatUser.lastMessageTime,
      inProgress: true,
    }))
    dispatch(setChatInProgress(await communityChatDetail(communityChatUser.roomId)));
    dispatch(setIsChatOpen(true));
  }

  return (
    <div>
      {communityChatUserList.map((communityChatUser, index) => (
        <div
          className='
            bg-light-white
            dark:bg-dark-white
          ' 
          onClick={
            () => handleChatUser(
              communityChatUser
            )
          }
        >
          <ChatUser index={index}/>
        </div>
      ))}

    <div
      className={`
        ${isChatOpen ? 'translate-x-[20rem]' : '-translate-x-full'} 
        max-md:hidden absolute top-0 -z-[100] w-[35rem] max-w-[40rem] h-full pt-[3.2rem] lg:pt-0
        bg-light-white outline-light-border-1
        dark:bg-dark-white dark:outline-dark-border-1
        transition-all duration-300 ease-in-out outline outline-1
      `}
    >
      <Chat otherId={otherId} />
    </div>
      
    </div >
  )
}

export default ChatUserList;