import React, { useEffect, useState } from 'react';
import ChatUser, { ChatUserType } from './ChatUser';
import Chat from './Chat';
import { RootState } from '@store/store';
import { useSelector } from 'react-redux';
import { communityChatList } from '@services/communityChatService';

type Props = {
  isLogin: boolean;
  userId: number;
}

const ChatUserList = (props: Props) => {
  const selectedCategory = useSelector((state: RootState) => state.chatStore.selectedCategory);
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

  return (
    <div>
      {chatUserList.map((chatUser, index) => (
        <ChatUser chatUser={chatUser}/>
      ))}
      <Chat />
    </div>
  )
}

export default ChatUserList;