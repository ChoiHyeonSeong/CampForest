import React, { useEffect, useState } from 'react';
import ChatUser, { ChatUserType } from './ChatUser';
import Chat, { Message } from './Chat';
import { RootState } from '@store/store';
import { useDispatch, useSelector } from 'react-redux';
import { communityChatList } from '@services/communityChatService';
import { setChatInProgress, setRoomId } from '@store/chatSlice';

type Props = {
  isLogin: boolean;
  userId: number;
}

const ChatUserList = (props: Props) => {
  const dispatch = useDispatch();
  const selectedCategory = useSelector((state: RootState) => state.chatStore.selectedCategory);
  const storedRoomId = useSelector((state: RootState) => state.chatStore.roomId);
  const [isOpenChat, setIsOpenChat] = useState(false);
  const [otherId, setOtherId] = useState(0);
  const [chatUserList, setChatUserList] = useState<ChatUserType[]>([]);

  const fetchCommunityChatList = async () => {
    try {
      const result = await communityChatList(props.userId);
      setChatUserList(result);
    } catch (error) {
      console.error('일반 채팅방 목록 조회 실패: ', error);
    }
  }

  useEffect(() => {
    if(selectedCategory === '일반') {
      fetchCommunityChatList();
    } else {
        
    }
  }, [selectedCategory])

  const handleChatUser = async (roomId: number, otherId: number) => {
    if(roomId !== storedRoomId) {
      dispatch(setChatInProgress([]));
      dispatch(setRoomId(roomId));
    }
    setOtherId(otherId);
    setIsOpenChat(true);
  }

  return (
    <div>
      {chatUserList.map((chatUser, index) => (
        <div onClick={() => handleChatUser(chatUser.roomId, chatUser.otherUserId)}>
          <ChatUser chatUser={chatUser}/>
        </div>
      ))}

    <div
      className={`
        ${isOpenChat ? 'translate-x-[20rem]' : '-translate-x-full'} 
        max-md:hidden absolute top-0 -z-[100] w-[35rem] max-w-[40rem] h-full pt-[3.2rem] lg:pt-0
        bg-light-white outline-light-border-1
        dark:bg-dark-white dark:outline-dark-border-1
        transition-all duration-300 ease-in-out outline outline-1
      `}
    >
      <Chat otherId={otherId} setIsOpenChat={setIsOpenChat}/>
    </div>
      
    </div >
  )
}

export default ChatUserList;