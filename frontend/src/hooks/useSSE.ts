// useSSE.ts
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
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  const subscribe = useCallback(() => {
    if (eventSource) {
      eventSource.close();
    }

    const newEventSource = new EventSource(`https://i11d208.p.ssafy.io/api/notification/subscribe`);

    newEventSource.onmessage = (event: MessageEvent) => {
      const notification: Notification = JSON.parse(event.data);
      setNotifications(prev => [...prev, notification]);
    };

    newEventSource.onerror = (error: Event) => {
      console.error('SSE error:', error);
      setError(error instanceof Error ? error : new Error('Unknown error occurred'));
      newEventSource.close();
    };

    newEventSource.addEventListener('notification', (event: MessageEvent) => {
      const notification: Notification = JSON.parse(event.data);
      setNotifications(prev => [...prev, notification]);
    });

    setEventSource(newEventSource);
  }, []);

  const unsubscribe = useCallback(() => {
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
    }
  }, [eventSource]);

  useEffect(() => {
    return () => {
      unsubscribe();
    };
  }, [unsubscribe]);

  return { notifications, error, subscribe, unsubscribe };
};

export default useSSE;