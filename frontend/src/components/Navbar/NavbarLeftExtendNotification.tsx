import React, { useEffect } from 'react'

import { EventSourcePolyfill, NativeEventSource } from "event-source-polyfill";
import { ReactComponent as LeftArrow } from '@assets/icons/arrow-left.svg'
import NotificationList from '@components/Notification/NotificationList';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';

type Props = {
  isExtendMenuOpen: boolean;
  toggleExtendMenu: (param:string) => void;
}

const EventSource = EventSourcePolyfill || NativeEventSource;

const NavbarLeftExtendCommunity = (props: Props) => {
  const userState = useSelector((state: RootState) => state.userStore);

  useEffect(() => {
   if (userState.isLoggedIn) {
    let eventSource: EventSource;
    const fetchSSE = async () => {
      try {
        eventSource = new EventSource(
          `https://i11d208.p.ssafy.io/api/notification/subscribe`,
          {
            headers: {
              Authorization: sessionStorage.getItem('accessToken') || '',
            },
            withCredentials: true,
            heartbeatTimeout: 86400000, // 연결 시간 24시간
          }
        );

        eventSource.onmessage = async (event) => {
          const result = await event.data;
          console.log(result);
        };

        eventSource.onerror = async (event) => {
          
        };
      } catch (error) {
        console.error("fetchSSE error: ", error);
      };
    }
    fetchSSE();
    return () => eventSource.close();
   }
  })

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