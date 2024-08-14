import { useState, useEffect, useCallback, useRef } from 'react';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { RootState, store } from '@store/store';
import {
  addMessageToChatInProgress,
  setChatInProgress,
  setCommunityChatUserList,
  setCommunityUnreadCount,
  setSaleStatus,
  setTransactionChatUserList,
  setTransactionUnreadCount,
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
import { setOpponentInfo, setTransactionInfo } from '@store/reviewSlice';

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
  const isLoggedIn = useSelector((state: RootState) => state.userStore.isLoggedIn);
  const clientRef = useRef<Client | null>(null);

  // 채팅방 목록 가져오기
  const fetchChatList = async () => {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      const communityChatUserList = await communityChatList();
      let coummunityUnreadCount = 0;
      if (communityChatUserList) {
        communityChatUserList.forEach((chatUser: ChatUserType) => {
          coummunityUnreadCount += chatUser.unreadCount;
        });
        store.dispatch(setCommunityChatUserList(communityChatUserList));
      }
      const transactionChatUserList = await transactionChatList();
      let transactionUnreadCount = 0;
      if (transactionChatUserList) {
        transactionChatUserList.forEach((chatUser: ChatUserType) => {
          transactionUnreadCount += chatUser.unreadCount;
        });
        store.dispatch(setTransactionChatUserList(transactionChatUserList));
      }
      store.dispatch(setCommunityUnreadCount(coummunityUnreadCount));
      store.dispatch(setTransactionUnreadCount(transactionUnreadCount));
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
              
              const fetchedMessages = await transactionChatDetail(response.message.roomId);
              store.dispatch(setChatInProgress(fetchedMessages.messages));
              let lastSaleState = '';
              let confirmedCount = 0;
              for (const message of fetchedMessages.messages) {
                if (message.transactionEntity) {
                  if (message.transactionEntity.saleStatus) {
                    if (message.transactionEntity.saleStatus === 'CONFIRMED') {
                      ++confirmedCount;
                      if (confirmedCount === 2) {
                        lastSaleState = message.transactionEntity.saleStatus;
                        dispatch(setOpponentInfo({opponentId: state.chatStore.otherId, opponentNickname: state.reviewStore.opponentNickname}))
                        dispatch(setTransactionInfo({
                          ...state.reviewStore,
                          productType: 'SALE',
                          price: message.transactionEntity.realPrice,
                          deposit: 0
                        }))
                      }
                    } else if (message.transactionEntity.saleStatus !== '') {
                      lastSaleState = message.transactionEntity.saleStatus;
                    }
                  } else {
                    if (message.transactionEntity.rentStatus === 'CONFIRMED') {
                      ++confirmedCount;
                      if (confirmedCount === 2) {
                        console.log('setTransactionInfo', message.transactionEntity);
                        lastSaleState = message.transactionEntity.rentStatus;
                        dispatch(setOpponentInfo({...state.reviewStore, opponentId: state.chatStore.otherId}))
                        dispatch(setTransactionInfo({
                          ...state.reviewStore,
                          productType: 'RENT',
                          price: message.transactionEntity.realPrice,
                          deposit: message.transactionEntity.deposit
                        }))
                      }
                    } else {
                      lastSaleState = message.transactionEntity.rentStatus;
                    }
                  }
                }
              }
        
              console.log('lastSaleState', lastSaleState);
              dispatch(setSaleStatus(lastSaleState));
              publishMessage(`/pub/transaction/${response.message.roomId}/read`, state.userStore.userId);
            } else {
              dispatch(updateTransactionChatUserList({ ...response.message, inProgress: false }));
            }
          }
          else if (response.messageType === 'READ') {
              dispatch(setChatInProgress([...store.getState().chatStore.chatInProgress.map((message: any) => 
                message.message ? (
                  message.message.roomId === response.roomId && message.message.senderId !== response.senderId
                  ? { transactionEntity: message.transactionEntity, message: {...message.message, read: true } }
                  : message
                ) : (
                  message.roomId === response.roomId && message.senderId !== response.senderId
                  ? { ...message, read: true }
                  : message
                )
              )]))
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
        console.log(str);
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
