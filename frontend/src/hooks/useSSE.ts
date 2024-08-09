import { getNotificationList } from "@services/notificationService";
import { addNewNotification, setNotificationList } from "@store/notificationSlice";
import { RootState } from "@store/store";
import { EventSourcePolyfill } from "event-source-polyfill";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useSSE = () => {
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => (state.userStore));
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null);
  const lastConnectionTimeRef = useRef(0);
  const [retryCount, setRetryCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const maxRetries = 5;

  const createEventSource = useCallback(() => {
    const now = Date.now();
    if (now - lastConnectionTimeRef.current < 5000) { // 5초 내 재연결 방지
      console.log("연결 시도가 너무 빠릅니다. 잠시 후 다시 시도하세요.");
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

    // 새로운 알림 도착
    eventSource.addEventListener('notification', (event: any) => {
      const eventData = JSON.parse(event.data);
      console.log('새 알림', eventData);
      switch (eventData.notificationType) {
        case 'CHAT': {
          break;
        }
        default: {
          dispatch(addNewNotification(eventData));
        }
      }
    });

    eventSource.onerror = (error) => {
      console.error("SSE 오류:", error);
      setIsConnected(false);
      eventSource.close();
      setRetryCount(prevCount => prevCount + 1);
    };

    eventSourceRef.current = eventSource;
  }, [retryCount, dispatch]);

  useEffect(() => {
    let retryTimeout: NodeJS.Timeout;

    if (userState.isLoggedIn && !isConnected) {
      createEventSource();
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
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [userState.isLoggedIn, createEventSource, isConnected]);

  return isConnected;
};

export default useSSE;