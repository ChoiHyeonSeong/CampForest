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
    <div className={`fixed z-30 w-[calc(100%-25rem)] max-w-[40rem] h-full
        transition-all duration-300 ease-in-out max-md:hidden
        ${props.isExtendMenuOpen ? 'translate-x-[25rem]' : '-translate-x-full'} 
        bg-white outline outline-1 outline-[#CCCCCC]`
    }>
      <div className='flex border-b mx-[2rem] py-[1rem] items-center'>
        <div className='rounded-full border size-12 me-4'>
          <img src={userImage} alt="NoImg" className='fit'/>
        </div>
        <div className='text-lg'>하치와레미콘</div>
        <div className='ms-auto'><CloseIcon className='hidden md:block md:size-8' fill='000000' /></div>
      </div>
    </div>
  )
}

export default Chat;