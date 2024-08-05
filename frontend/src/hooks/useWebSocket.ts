// useWebSocket.ts
import { useState, useEffect, useCallback } from 'react';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { RootState, store } from '@store/store';
import { setChatInProgress } from '@store/chatSlice';

type UseWebSocketProps = {
  jwt: string | null;
}

export type UseWebSocketReturn = {
  client: Client | null;
  connected: boolean;
  sendMessage: (destination: string, body: any) => void;
  subscribe: (destination: string, callback: (message: Message) => void) => void;
}

export const useWebSocket = ({ jwt }: UseWebSocketProps): UseWebSocketReturn => {
  const [client, setClient] = useState<Client | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const newClient = new Client({
      webSocketFactory: () => new SockJS('https://i11d208.p.ssafy.io/ws'),
      connectHeaders: {
        Authorization: `${jwt}`,
      },
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    const subscribeToChatRooms = (client: Client) => {
      const chatRoomListString = sessionStorage.getItem('chatRoomList');
      if (chatRoomListString) {
        const chatRoomList = JSON.parse(chatRoomListString);
        chatRoomList.forEach((chatRoom: any) => {
          console.log('subscribe 해보기', chatRoom.roomId);
          client.subscribe(`/sub/community/${chatRoom.roomId}`, (message) => {
            const response = JSON.parse(message.body);
            console.log('Received chat message:', response);

            const state: RootState = store.getState();

            if (state.chatStore.roomId === response.roomId) {
              console.log('메시지 저장함')
              store.dispatch(setChatInProgress([...state.chatStore.chatInProgress, response]));
            }
          });
        });
      }
    };

    newClient.onConnect = () => {
      setConnected(true);
      console.log('Connected to WebSocket');
      subscribeToChatRooms(newClient);
    };

    newClient.onDisconnect = () => {
      setConnected(false);
      console.log('Disconnected from WebSocket');
    };

    newClient.activate();
    setClient(newClient);

    return () => {
      if (newClient.active) {
        newClient.deactivate();
      }
    };
  }, [jwt]);

  const sendMessage = useCallback((destination: string, body: any) => {
    if (client && client.active) {
      client.publish({
        destination,
        body: JSON.stringify(body),
      });
    }
  }, [client]);

  const subscribe = useCallback((destination: string, callback: (message: Message) => void) => {
    if (client && client.active) {
      client.subscribe(destination, callback);
    }
  }, [client]);

  return { client, connected, sendMessage, subscribe };
};