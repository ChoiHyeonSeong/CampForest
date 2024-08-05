import React from 'react';

import { ReactComponent as CloseIcon } from '@assets/icons/close.svg';
import userImage from '@assets/logo192.png'
import { RootState } from '@store/store';
import { useSelector } from 'react-redux';

export type Message = {
  messageId: number;
  content: string;
  senderId: number;
  roomId: number;
  createdAt: string;
  read: boolean;
}

const Chat = () => {
  const otherUserId = useSelector((state: RootState) => state.chatStore.otherUserId);

  return (
    // 데스크탑, 태블릿
    <div 
      className={`
        ${otherUserId !== 0 ? 'translate-x-[20rem]' : '-translate-x-full'} 
        max-md:hidden fixed top-0 z-[35] w-[35rem] max-w-[40rem] h-full pt-[3.2rem] lg:pt-0
        bg-light-white outline-light-border-1
        dark:bg-dark-white dark:outline-dark-border-1
        transition-all duration-300 ease-in-out outline outline-1
      `}
    >
      <div 
        className={`
          flex items-center mx-[2rem] py-[1rem]
          border-light-border
          dark:border-dark-border
          border-b
        `}
      >
        <div 
          className={`
            size-[3rem] me-[1rem]
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
        <div className={`text-lg`}>
          하치와레미콘
        </div>
        <div className={`ms-auto`}>
          <CloseIcon 
            className={`
              hidden md:block md:size-[2rem]
              fill-light-black
              dark:fill-dark-black
            `}
          />
        </div>
      </div>
    </div>
  )
}

export default Chat;