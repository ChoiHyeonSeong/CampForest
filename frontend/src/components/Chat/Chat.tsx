import React from 'react';

import { ReactComponent as CloseIcon } from '@assets/icons/close.svg';
import userImage from '@assets/logo192.png'

type Props = {
  isExtendMenuOpen: boolean;
  toggleExtendMenu: (param:string) => void;
}

const Chat = (props: Props) => {
  return (
    // 데스크탑, 태블릿
    <div 
      className={`
        ${props.isExtendMenuOpen ? 'translate-x-[25rem]' : '-translate-x-full'} 
        max-md:hidden fixed z-[35] w-[calc(100%-25rem)] max-w-[40rem] h-full pt-[3.2rem] 
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
            className={`hidden md:block md:size-[2rem]`} fill='000000'
          />
        </div>
      </div>
    </div>
  )
}

export default Chat;