import React, { useEffect, useState } from 'react';

import userImage from '@assets/logo192.png'
import { userPage } from '@services/userService';

export type ChatUserType = {
  roomId: number;
  otherUserId: number;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

type Props = {
  chatUser: ChatUserType;
}

const ChatUser = (props: Props) => {
  const [nickname, setNickname] = useState('');
  const fetchOtherUser = async () => {
    const result = await userPage(props.chatUser.otherUserId);
    setNickname(result.nickname);
  }

  useEffect(() => {
    fetchOtherUser();
  }, [])

  return (
    <div 
      className={`
        flex gap-4 items-center px-[1.5rem] py-[1rem] 
        border-light-border
        dark:border-dark-border
        border-b
      `}
    >
      <div 
        className={`
          w-1/6
          border-light-border
          dark:border-dark-border
          rounded-full border
        `}
      >
        <img 
          src={userImage} 
          alt="NoImg" 
          className={`fit`}
        />
      </div>
      <div className={`w-4/5`}>
        <div className={`flex items-center mb-[0.25rem]`}>
          <div
            className={`
              text-light-text
              dark:text-dark-text
              font-medium  
            `}
          >
            {nickname}
          </div>
          <div 
            className={`
              ms-auto
              text-light-text-secondary
              dark:text-dark-text-secondary
              text-xs
            `}
          >
            {props.chatUser.lastMessageTime}
          </div>
        </div>
        <div className={`flex items-center`}>
          <div
            className={`
              text-light-text-secondary
              dark:text-dark-text-secondary
              text-[1rem]
            `}
          >
            {props.chatUser.lastMessage}
          </div>
          <div 
            className={`
              ms-auto px-[0.5rem]
              bg-light-signature text-light-white 
              dark:bg-dark-signature dark:text-light-white
              text-sm rounded-lg
            `}
          >
            {props.chatUser.unreadCount}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatUser;