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
      className={`fixed z-[35] w-[20rem] h-full pt-[3.2rem]
        transition-all duration-300 ease-in-out
        ${props.isExtendMenuOpen ? 'translate-x-[5rem]' : '-translate-x-full'} 
        bg-white outline outline-1 outline-[#CCCCCC]`
      }
    >
      <div className='h-20 ps-4 flex items-center'>
        <LeftArrow className='me-3 cursor-pointer w-5 h-5' onClick={() => props.toggleExtendMenu('chat')}/>
        <p className='text-2xl'>채팅</p>
      </div>
      <div className='grid grid-cols-2 text-center py-2 border-b'>
        <div>거래</div>
        <div>커뮤니티</div>
      </div>
      {/* 채팅 유저 목록 */}
      <ChatUserList />
    </div>
  )
}

export default NavbarLeftExtendChat;