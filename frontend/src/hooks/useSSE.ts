import { getNotificationList } from "@services/notificationService";
import { addMessageToChatInProgress, updateCommunityChatUserList, updateMessageReadStatus } from "@store/chatSlice";
import { addNewNotification, setNotificationList } from "@store/notificationSlice";
import { RootState } from "@store/store";
import { useWebSocket } from "Context/WebSocketContext";
import { EventSourcePolyfill } from "event-source-polyfill";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useSSE = () => {
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.userStore);
  const chatState = useSelector((state: RootState) => state.chatStore);
  const roomIdRef = useRef(chatState.roomId);
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null);
  const lastConnectionTimeRef = useRef(0);
  const [retryCount, setRetryCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const { subscribe, publishMessage } = useWebSocket();
  const maxRetries = 5;

  function subscribeToCommunityChat(roomId: number) {
    // 읽음 처리를 받았을 때
    subscribe(`/sub/community/${roomId}/readStatus`, (message) => {
      const readerId = JSON.parse(message.body); // 읽은 사람 Id
      if (userState.userId !== readerId) {
        dispatch(updateMessageReadStatus({ roomId: roomId, readerId }));
      }  
    });
  
    // 메세지를 받았을 때
    subscribe(`/sub/community/${roomId}`, (message: { body: string }) => {
      const response = JSON.parse(message.body);
      const currentRoomId = roomIdRef.current;
      if (currentRoomId === response.roomId) {
        dispatch(updateCommunityChatUserList({...response, inProgress: true}));
        publishMessage(`/pub/room/${response.roomId}/markAsRead`, userState.userId);
        dispatch(addMessageToChatInProgress(response));
      } else {
        dispatch(updateCommunityChatUserList({...response, inProgress: false}));
      }
    });
  }

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
          // subscribeToChat(eventData.)
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
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    }; 
  }, [userState.isLoggedIn, createEventSource, isConnected, retryCount]);

  return isConnected;
};

export default useSSE;