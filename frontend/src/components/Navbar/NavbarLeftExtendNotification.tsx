import React from 'react'

import { ReactComponent as LeftArrow } from '@assets/icons/arrow-left.svg'
import NotificationList from '@components/Notification/NotificationList';

type Props = {
  isExtendMenuOpen: boolean;
  toggleExtendMenu: (param:string) => void;
}

const NavbarLeftExtendCommunity = (props: Props) => {

  return (
    <div
      className={`fixed z-30 w-[25rem] h-full md:mt-11 lg:mt-0 mb-11 md:mb-0 
        transition-all duration-300 ease-in-out 
        ${props.isExtendMenuOpen ? 'translate-x-[5rem]' : '-translate-x-full'} 
        bg-white outline outline-1 outline-[#CCCCCC]`
      }
    >
      <div className='h-20 ps-4 flex items-center'>
        <LeftArrow className='me-3 cursor-pointer w-5 h-5' onClick={() => props.toggleExtendMenu('notification')}/>
        <p className='text-2xl'>알림</p>
      </div>
      <NotificationList />
    </div>
  )
}

export default NavbarLeftExtendCommunity