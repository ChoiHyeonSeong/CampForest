import { RootState } from "@store/store";
import { EventSourcePolyfill } from "event-source-polyfill";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useSSE = () => {
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => (state.userStore));
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

    eventSource.addEventListener('notification', (event: any) => {
      const eventData = JSON.parse(event.data);
      console.log("Received Data", eventData)
    })

    eventSource.onerror = (error) => {
      console.error("SSE 오류:", error);
      eventSource.close();
      setRetryCount(prevCount => prevCount + 1);
    };

    eventSourceRef.current = eventSource;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryCount]);

  useEffect(() => {
    let retryTimeout: NodeJS.Timeout;

    const retryWithBackoff = () => {
      if (retryCount < maxRetries) {
        const backoffTime = Math.min(1000 * (2 ** retryCount), 30000);
        console.log(`${backoffTime / 1000}초 후 재연결 시도`);
        retryTimeout = setTimeout(() => {
          createEventSource();
        }, backoffTime);
      }
    };

    if (userState.isLoggedIn) {
      if (retryCount === 0) {
        createEventSource();
      } else {
        retryWithBackoff();
      }
    } else {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
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
  }, [userState.isLoggedIn, createEventSource, retryCount]);
}

export default useSSE;