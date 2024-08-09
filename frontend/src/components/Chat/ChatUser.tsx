import React, { useEffect, useState } from 'react';

import noImg from '@assets/images/basic_profile.png'
import { userPage } from '@services/userService';
import { store } from '@store/store';

export type ChatUserType = {
  roomId: number;
  otherUserId: number;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

type Props = {
  index: number;
}

const ChatUser = (props: Props) => {
  const chatUser = store.getState().chatStore.communityChatUserList[props.index];
  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [lastMessageTime, setLastMessageTime] = useState('');
  const fetchOtherUser = async () => {
    const result = await userPage(chatUser.otherUserId);
    setNickname(result.nickname);
    setProfileImage(result.profileImage);
  }

  useEffect(() => {
    fetchOtherUser();
  }, [])
  
  useEffect(() => {
    setLastMessageTime(calculateTimeDifference(chatUser.lastMessageTime));
  }, [chatUser.lastMessageTime])

  const calculateTimeDifference = (modifiedAt: string) => {
    const modifiedDate = new Date(modifiedAt);
    const currentDate = new Date();
    const differenceInMilliseconds = currentDate.getTime() - modifiedDate.getTime();
    const differenceInMinutes = Math.floor(differenceInMilliseconds / 1000 / 60);
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    const year = modifiedDate.getFullYear();
    const month = String(modifiedDate.getMonth() + 1).padStart(2, '0');
    const day = String(modifiedDate.getDate()).padStart(2, '0');
  
    // 같은 해가 아니면 년, 월, 일로 표기
    if (modifiedDate.getFullYear !== currentDate.getFullYear) {
      return `${year}-${month}-${day}`;
    } 
    
    // 같은 해, 하루 이상 차이 난다면 월, 일로 표기
    if (differenceInMinutes >= 1440) {
      return `${month}-${day}`;
    }
  
    if (differenceInMinutes >= 60) {
      return `${differenceInHours}시간 전`;
    }
  
    return `${differenceInMinutes}분 전`;
  };

  return (
    <div 
      className={`
        flex items-center px-[0.8rem] py-[1.25rem] 
        border-light-border
        dark:border-dark-border
        border-b
      `}
    >
      <div className='flex w-2/3'>
        {/* 프로필 */}
        <div 
          className={`
            shrink-0 size-[2.6rem] me-[0.75rem]
            border-light-border
            dark:border-dark-border
            rounded-full border overflow-hidden
          `}
        >
          <img 
            src={profileImage ? profileImage : noImg}
            alt={noImg}
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
            {chatUser.lastMessage}
          </div>
        </div>
      </div>

      <div className='w-1/3 text-end'>
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
        <span 
          className={`
            ${chatUser.unreadCount === 0 ? '' : 'bg-light-signature dark:bg-dark-signature text-light-white dark:text-dark-white'}
            px-[0.5rem] me-[0.5rem]
            text-sm rounded-lg text-center
          `}
        >
          {chatUser.unreadCount === 0 ? '' : chatUser.unreadCount}
        </span>

      </div>


    </div>
  )
}

export default ChatUser;