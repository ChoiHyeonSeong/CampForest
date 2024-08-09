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
      className={`
        ${props.isExtendMenuOpen ? 'translate-x-[5rem]' : '-translate-x-full'}
        fixed z-[35] w-[20rem] h-[100%] pt-[3.2rem] lg:pt-[0]
        bg-light-white border-light-border-1
        dark:bg-dark-white dark:border-dark-border-1
        border-r transition-all duration-300 ease-in-out
      `}
    >
      <div className={`flex items-center h-[5rem] ps-[1rem]`}>
        <LeftArrow 
          onClick={() => props.toggleExtendMenu('notification')}
          className={`
            w-[1.25rem] h-[1.25rem] me-[0.75rem] 
            fill-light-border-icon
            dark:fill-dark-border-icon
            cursor-pointer
          `}
        />
        <p className={`text-2xl font-medium`}>알림</p>
      </div>
      <NotificationList />
    </div>
  )
}

export default NavbarLeftExtendCommunity