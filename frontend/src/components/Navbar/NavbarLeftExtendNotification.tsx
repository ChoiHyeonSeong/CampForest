import React, { useEffect, useRef, useState, useCallback } from 'react'
import { ReactComponent as LeftArrow } from '@assets/icons/arrow-left.svg'
import NotificationList from '@components/Notification/NotificationList';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@store/store';
import { EventSourcePolyfill } from 'event-source-polyfill';

type Props = {
  isExtendMenuOpen: boolean;
  toggleExtendMenu: (param:string) => void;
}

const NavbarLeftExtendCommunity = (props: Props) => {
  const userState = useSelector((state: RootState) => state.userStore);
  const dispatch = useDispatch();
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 5;

  const createEventSource = useCallback(() => {
    if (retryCount >= maxRetries) {
      console.error("최대 재시도 횟수 초과");
      return;
    }

    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      console.error("액세스 토큰이 없습니다.");
      return;
    }

    console.log("SSE 연결 시도...");
    const eventSource = new EventSourcePolyfill(
      `${process.env.REACT_APP_BACKEND_URL}/notification/subscribe`,
      {
        headers: {
          Authorization: `${accessToken}`,
        },
        withCredentials: true,
      }
    );

    eventSource.onopen = (event) => {
      console.log("SSE 연결 성공", event);
      setRetryCount(0);
    };

    eventSource.onmessage = async (event) => {
      console.log("SSE 메시지 수신:", event);
      try {
        const data = JSON.parse(event.data);
        // dispatch(addNotification(data));
        console.log(data);
      } catch (error) {
        console.error("알림 데이터 파싱 오류:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE 오류:", error);
      eventSource.close();
      setRetryCount(prevCount => prevCount + 1);
    };

    eventSourceRef.current = eventSource;
  }, [dispatch, retryCount]);

  // 디버깅을 위한 임시 함수
  const testSSEConnection = () => {
    console.log("SSE 연결 테스트 시작");
    createEventSource();
  };

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
        {/* 디버깅을 위한 임시 버튼 */}
        <button onClick={testSSEConnection}>SSE 테스트</button>
      </div>
      <NotificationList />
    </div>
  )
}

export default NavbarLeftExtendCommunity