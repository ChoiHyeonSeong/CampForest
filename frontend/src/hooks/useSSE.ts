import { useState, useEffect, useCallback } from 'react';

export type Notification = {
  id: number;
  message: string;
  type: string;
  createdAt: string;
}

interface UseSSEResult {
  notifications: Notification[];
  error: Error | null;
  subscribe: () => void;
  unsubscribe: () => void;
}

const useSSE = (): UseSSEResult => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [controller, setController] = useState<AbortController | null>(null);

  const subscribe = useCallback(() => {
    if (controller) {
      controller.abort();
    }

    const newController = new AbortController();
    setController(newController);

    const accessToken = sessionStorage.getItem('accessToken'); // 실제 accessToken을 여기에 넣으세요

    fetch('https://i11d208.p.ssafy.io/api/notification/subscribe', {
      headers: {
        'Authorization': `${accessToken}`,
      },
      signal: newController.signal,
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      function read() {
        reader.read().then(({ done, value }) => {
          if (done) {
            console.log('Stream complete');
            return;
          }
          const chunk = decoder.decode(value, { stream: true });
          const notifications = chunk.split('\n\n')
            .filter(notification => notification.trim() !== '')
            .map(notification => {
              const data = notification.replace('data: ', '');
              return JSON.parse(data) as Notification;
            });
          
          setNotifications(prev => [...prev, ...notifications]);
          read();
        }).catch(error => {
          console.error('Stream error:', error);
          setError(error);
        });
      }

      read();
    }).catch(error => {
      console.error('Fetch error:', error);
      setError(error);
    });
  }, []);

  const unsubscribe = useCallback(() => {
    if (controller) {
      controller.abort();
      setController(null);
    }
  }, [controller]);

  useEffect(() => {
    return () => {
      unsubscribe();
    };
  }, [unsubscribe]);

  return { notifications, error, subscribe, unsubscribe };
};

export default useSSE;