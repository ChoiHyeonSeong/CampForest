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
  const [lastMessageTime, setLastMessageTime] = useState('');
  const fetchOtherUser = async () => {
    const result = await userPage(props.chatUser.otherUserId);
    setNickname(result.nickname);
  }

  useEffect(() => {
    fetchOtherUser();
    setLastMessageTime(calculateTimeDifference(props.chatUser.lastMessageTime));
  }, [])

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };

  const calculateTimeDifference = (modifiedAt: string) => {
    const modifiedDate = new Date(modifiedAt);
    const currentDate = new Date();
    const differenceInMilliseconds = currentDate.getTime() - modifiedDate.getTime();
  
    const differenceInMinutes = Math.floor(differenceInMilliseconds / 1000 / 60);
    const differenceInHours = Math.floor(differenceInMinutes / 60);
  
    if (differenceInMinutes >= 1440) {
      return formatDate(modifiedDate);
    }
  
    if (differenceInMinutes >= 60) {
      return `${differenceInHours}시간 전`;
    }
  
    return `${differenceInMinutes}분 전`;
  };

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
            {lastMessageTime}
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
              ${props.chatUser.unreadCount === 0 ? 'hidden' : ''}
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