import { useState, useEffect, useCallback, useRef } from 'react';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { RootState, store } from '@store/store';
import {
  addMessageToChatInProgress,
  setChatInProgress,
  setCommunityChatUserList,
  setSaleStatus,
  setTotalUnreadCount,
  setTransactionChatUesrList,
  updateCommunityChatUserList,
  updateMessageReadStatus,
  updateTransactionChatUserList,
} from '@store/chatSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  communityChatList,
  transactionChatDetail,
  transactionChatList,
} from '@services/chatService';
import { ChatUserType } from '@components/Chat/ChatUser';

type UseWebSocketProps = {
  jwt: string | null;
};

export type UseWebSocketReturn = {
  connected: boolean;
  publishMessage: (destination: string, body: any) => void;
  subscribe: (destination: string, callback: (message: Message) => void) => void;
};

export const useWebSocket = ({ jwt }: UseWebSocketProps): UseWebSocketReturn => {
  const dispatch = useDispatch();
  const [connected, setConnected] = useState(false);
  const chatState = useSelector((state: RootState) => state.chatStore);
  const isLoggedIn = useSelector((state: RootState) => state.userStore.isLoggedIn);
  const clientRef = useRef<Client | null>(null);

  // 채팅방 목록 가져오기
  const fetchChatList = async () => {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      const communityChatUserList = await communityChatList();
      let count = 0;
      if (communityChatUserList) {
        communityChatUserList.forEach((chatUser: ChatUserType) => {
          count += chatUser.unreadCount;
        });
        store.dispatch(setCommunityChatUserList(communityChatUserList));
      }
      const transactionChatUserList = await transactionChatList();
      if (transactionChatUserList) {
        transactionChatUserList.forEach((chatUser: ChatUserType) => {
          count += chatUser.unreadCount;
        });
        store.dispatch(setTransactionChatUesrList(transactionChatUserList));
      }
      store.dispatch(setTotalUnreadCount(count));
    }
  };

  const subscribeInitial = useCallback((client: Client) => {
    // 사용자가 진행 중이었던 채팅방 목록 불러오고 구독
    const communityChatUserList = store.getState().chatStore.communityChatUserList;
    if (communityChatUserList) {
      communityChatUserList.forEach((chatRoom: any) => {
        // 메시지를 받았을 때
        client.subscribe(`/sub/community/${chatRoom.roomId}`, (message) => {
          const response = JSON.parse(message.body);
          console.log('Received chat message:', response);
          const state: RootState = store.getState();
          if (response.type === 'READ') {
            dispatch(
              updateMessageReadStatus({ roomId: chatRoom.roomId, readerId: response.senderId }),
            );
          }
          // 현재 열려 있는 채팅방 내용 갱신
          else if (state.chatStore.roomId === response.roomId) {
            dispatch(updateCommunityChatUserList({ ...response, inProgress: true }));
            publishMessage(`/pub/room/${response.roomId}/markAsRead`, state.userStore.userId);
            dispatch(addMessageToChatInProgress(response));
          } else {
            // 채팅방 목록 업데이트
            dispatch(updateCommunityChatUserList({ ...response, inProgress: false }));
          }
        });
      });
    }

    const transactionChatUserList = store.getState().chatStore.transactionChatUserList;
    if (transactionChatUserList) {
      transactionChatUserList.forEach((chatRoom: any) => {
        // 메시지를 받았을 때
        client.subscribe(`/sub/transaction/${chatRoom.roomId}`, async (data) => {
          const response = JSON.parse(data.body);
          console.log('Received chat message: ', response);
          const state: RootState = store.getState();

          if (response.message && response.message.messageType === 'TRANSACTION') {
            if (state.chatStore.roomId === response.message.roomId) {
              dispatch(updateTransactionChatUserList({ ...response.message, inProgress: true }));
              publishMessage(`/pub/transaction/${response.message.roomId}/read`, state.userStore.userId);
              dispatch(addMessageToChatInProgress(response));
              dispatch(setSaleStatus(response.transactionEntity.saleStatus));
            } else {
              dispatch(updateTransactionChatUserList({ ...response.message, inProgress: false }));
            }
          }
          else if (response.messageType === 'READ') {
            dispatch(
              updateMessageReadStatus({ roomId: response.roomId, readerId: response.senderId }),
            );
          } 
          // 현재 열려 있는 채팅방 내용 갱신
          else if (response.messageType === 'MESSAGE') {
            if (state.chatStore.roomId === response.roomId) {
              dispatch(updateTransactionChatUserList({ ...response, inProgress: true }));
              publishMessage(`/pub/transaction/${chatRoom.roomId}/read`, state.userStore.userId);
              dispatch(addMessageToChatInProgress(response));
            } else {
              dispatch(updateTransactionChatUserList({ ...response, inProgress: false }));
            }
          } else {
            console.log('타입이 없습니다');
          }
        });
      });
    }
  }, [dispatch]);

  useEffect(() => {
    if (!jwt) {
      return; // JWT가 없으면 웹소켓 연결을 시도하지 않음.
    }
    const newClient = new Client({
      webSocketFactory: () => new SockJS(`${process.env.REACT_APP_BACKEND_WS}`),
      connectHeaders: {
        Authorization: `${jwt}`,
      },
      debug: (str) => {
        // console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    newClient.onConnect = async () => {
      setConnected(true);
      console.log('Connected to WebSocket');
      await fetchChatList();
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
  }, [isLoggedIn]);

  const publishMessage = (destination: string, body: any) => {
    if (clientRef.current && clientRef.current.active) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(body),
      });
    }
  }

  const subscribe = 
    (destination: string, callback: (message: Message) => void) => {
      if (clientRef.current && clientRef.current.active) {
        clientRef.current.subscribe(destination, callback);
      }
    }

  return { connected, publishMessage, subscribe };
};
