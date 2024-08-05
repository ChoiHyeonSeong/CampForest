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
        flex items-center px-[0.8rem] py-[1rem] 
        border-light-border
        dark:border-dark-border
        border-b
      `}
    >
      <div className='flex w-5/6'>
        {/* 프로필 */}
        <div 
          className={`
            shrink-0 size-[2.6rem] me-[0.75rem]
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

        <div className=''>
          {/* 닉네임 */}
          <div
            className={`
              text-light-text
              dark:text-dark-text
              font-semibold
            `}
          >
            {nickname}
          </div>

           {/* 마지막 메세지 */}
          <div
            className={`
              text-light-text-secondary
              dark:text-dark-text-secondary
              text-sm line-clamp-1
            `}
          >
            {props.chatUser.lastMessage}
          </div>
        </div>
      </div>

      <div>
        {/* 보낸 시간 */}
        <div 
          className={`
            mb-[0.25rem]
            text-light-text-secondary
            dark:text-dark-text-secondary
            text-xs font-medium
          `}
        >
          {lastMessageTime}
        </div>

        {/* 알림 개수 */}
        <div 
          className={`
            ${props.chatUser.unreadCount === 0 ? 'hidden' : ''}
            bg-light-signature text-light-white 
            dark:bg-dark-signature dark:text-light-white
            text-sm rounded-lg text-center
          `}
        >
          {props.chatUser.unreadCount}
        </div>

      </div>


    </div>
  )
}

export default ChatUser;