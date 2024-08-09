import { getNotificationList } from "@services/notificationService";
import { addNewNotification, setNotificationList } from "@store/notificationSlice";
import { RootState } from "@store/store";
import { EventSourcePolyfill } from "event-source-polyfill";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useSSE = () => {
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.userStore);
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null);
  const lastConnectionTimeRef = useRef(0);
  const [retryCount, setRetryCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const maxRetries = 5;

  const createEventSource = useCallback(() => {
    const now = Date.now();
    const backoffTime = Math.min(1000 * Math.pow(2, retryCount), 30000); // 최대 30초
    if (now - lastConnectionTimeRef.current < backoffTime) {
      console.log(`${backoffTime / 1000}초 후 재연결을 시도합니다.`);
      return;
    }
    lastConnectionTimeRef.current = now;

    if (retryCount >= maxRetries) {
      console.error("최대 재시도 횟수 초과");
      return;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
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
        heartbeatTimeout: 330000, // 5분 30초
      }
    );

    eventSource.onopen = async (event) => {
      console.log("SSE 연결 성공", event);
      setIsConnected(true);
      const notificationList = await getNotificationList();
      dispatch(setNotificationList(notificationList));
      setRetryCount(0);
    };

    eventSource.addEventListener('notification', (event: any) => {
      const eventData = JSON.parse(event.data);
      console.log('새 알림', eventData);
      switch (eventData.notificationType) {
        case 'CHAT':
          // 채팅 알림 처리
          break;
        default:
          dispatch(addNewNotification(eventData));
      }
    });

    eventSource.addEventListener('heartbeat', () => {
      console.log('하트비트 수신');
      // 필요한 경우 추가 로직
    });

    eventSource.onerror = (error) => {
      console.error("SSE 오류:", error);
      setIsConnected(false);
      eventSource.close();
      setRetryCount(prevCount => prevCount + 1);
      // 재연결 로직은 useEffect에서 처리
    };

    eventSourceRef.current = eventSource;
  }, [retryCount, dispatch]);

  useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout;

    if (userState.isLoggedIn && !isConnected) {
      reconnectTimeout = setTimeout(createEventSource, 1000 * Math.pow(2, retryCount));
    } else if (!userState.isLoggedIn) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        setIsConnected(false);
      }
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [userState.isLoggedIn, createEventSource, isConnected, retryCount]);

  return isConnected;
};

export default useSSE;