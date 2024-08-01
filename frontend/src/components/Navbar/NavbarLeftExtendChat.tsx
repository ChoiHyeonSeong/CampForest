import React from 'react'

import { ReactComponent as LeftArrow } from '@assets/icons/arrow-left.svg'
import ChatUserList from '@components/Chat/ChatUserList';

type Props = {
  isExtendMenuOpen: boolean;
  toggleExtendMenu: (param:string) => void;
}

const NavbarLeftExtendChat = (props: Props) => {
  return (
    <div
      className={`
        ${props.isExtendMenuOpen ? 'translate-x-[5rem]' : '-translate-x-full'}
        fixed z-[35] w-[20rem] h-[100%] pt-[3.2rem] lg:pt-[0]
        bg-light-white border-light-border-1
        dark:bg-dark-white dark:border-dark-border-1
        border-r transition-all duration-300 ease-in-out
      `}
    >
      {/* 상단 */}
      <div className={`flex items-center h-[5rem] ps-[1rem]`}>
        <LeftArrow 
          onClick={() => props.toggleExtendMenu('chat')}
          className={`
            w-[1.25rem] h-[1.25rem] me-[0.75rem] 
            fill-light-black
            dark:fill-dark-black
            cursor-pointer
          `}
        />
        <p className={`text-2xl`}>채팅</p>
      </div>

      {/* 채팅방 카테고리 */}
      <div 
        className={`
          grid grid-cols-2 py-2
          border-light-border-1
          dark:border-dark-border-1
          border-b text-center
        `}
      >
        <div>거래</div>
        <div>커뮤니티</div>
      </div>

      {/* 채팅 유저 목록 */}
      <ChatUserList />
    </div>
  )
}

export default NavbarLeftExtendChat;