import { useState, useEffect, useCallback, useRef } from 'react';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { RootState, store } from '@store/store';
import { setChatInProgress, updateCommunityChatUserList, updateMessageReadStatus } from '@store/chatSlice';

type UseWebSocketProps = {
  jwt: string | null;
}

export type UseWebSocketReturn = {
  connected: boolean;
  sendMessage: (destination: string, body: any) => void;
  markRead: (destination: string, body: any) => void;
  subscribe: (destination: string, callback: (message: Message) => void) => void;
}

export const useWebSocket = ({ jwt }: UseWebSocketProps): UseWebSocketReturn => {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);

  const subscribeInitial = useCallback((client: Client) => {
    const state = store.getState();

    if(state.userStore.isLoggedIn) {
      client.subscribe(`/notification/subscribe`, (message) => {
        const response = JSON.parse(message.body);
        console.log(response);
      })
    }

    // 사용자가 진행 중이었던 채팅방 목록 불러오고 구독
    const communityChatUserList = state.chatStore.communityChatUserList;
    if (communityChatUserList) {
      communityChatUserList.forEach((chatRoom: any) => {
        // 읽음 처리를 받았을 때
        client.subscribe(`/sub/community/${chatRoom.roomId}/readStatus`, (message) => {
          const readerId = JSON.parse(message.body); // 읽은 사람 Id
          if (state.userStore.userId !== readerId) {
            store.dispatch(updateMessageReadStatus({ roomId: chatRoom.roomId, readerId }));
          }  
        });

        // 메시지를 받았을 때
        client.subscribe(`/sub/community/${chatRoom.roomId}`, (message) => {
          const response = JSON.parse(message.body);
          // console.log('Received chat message:', response);
          
          // 현재 열려 있는 채팅방 내용 갱신
          if (state.chatStore.roomId === response.roomId) {
            store.dispatch(updateCommunityChatUserList({...response, inProgress: true}));
            if (clientRef.current && clientRef.current.active) {
              clientRef.current.publish({
                destination: `/pub/room/${response.roomId}/markAsRead`,
                body: JSON.stringify(state.userStore.userId),
              });
            }
            store.dispatch(setChatInProgress([...state.chatStore.chatInProgress, response]));
          } else {
            // 채팅방 목록 업데이트
            store.dispatch(updateCommunityChatUserList({...response, inProgress: false}));
          }
        });
      });
    }
  }, []);

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

    newClient.onConnect = () => {
      setConnected(true);
      console.log('Connected to WebSocket');
      subscribeInitial(newClient);
    };

    newClient.onDisconnect = () => {
      setConnected(false);
      console.log('Disconnected from WebSocket');
    };

    newClient.activate();
    clientRef.current = newClient;

    return () => {
      if (newClient.active) {
        newClient.deactivate();
      }
    };
  }, [jwt, subscribeInitial]);

  const sendMessage = useCallback((destination: string, body: any) => {
    if (clientRef.current && clientRef.current.active) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(body),
      });
    }
  }, []);

  const markRead = useCallback((destination: string, body: any) => {
    if (clientRef.current && clientRef.current.active) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(body),
      });
    }
  }, []);

  const subscribe = useCallback((destination: string, callback: (message: Message) => void) => {
    if (clientRef.current && clientRef.current.active) {
      clientRef.current.subscribe(destination, callback);
    }
  }, []);

  return { connected, sendMessage, markRead, subscribe };
};