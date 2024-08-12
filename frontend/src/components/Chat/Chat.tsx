import React, { useEffect, useRef, useState } from 'react';
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg';
import { RootState, store } from '@store/store';
import { useDispatch, useSelector } from 'react-redux';
import { communityChatDetail, transactionChatDetail } from '@services/chatService';
import { userPage } from '@services/userService';
import { useWebSocket } from 'Context/WebSocketContext';
import { setChatInProgress, setIsChatOpen, setProduct, setSaleStatus } from '@store/chatSlice';
import { formatTime } from '@utils/formatTime';
import ProductInfoChat from './ProductInfoChat';
import ChatTradeModal from './ChatTradeModal';
import ChatTradePropser from './ChatTradePropser';
import { productDetail } from '@services/productService';

type UnifiedMessage = {
  content: string;
  createdAt: string;
  messageId: number;
  senderId: number;
  read: boolean;
  roomId: number;
  transactionId?: number;
  messageType?: string;
  transactionEntity?: TransactionEntityType | undefined;
};

export type TransactionMessageType = {
  content: string;
  createdAt: string;
  messageId: number;
  messageType: string;
  read: boolean;
  roomId: number;
  senderId: number;
  transactionId?: number;
};

export type ReviewType = {

}

export type TransactionEntityType = {
  buyerId: number;
  confirmedByBuyer: boolean;
  confirmedBySeller: boolean;
  createdAt: string;
  fullyConfirmed: boolean;
  id: number;
  meetingPlace: string;
  meetingTime: string;
  modifiedAt: string;
  receiverId: number;
  requesterId: number;
  reviews: ReviewType[];
  saleStatus: string;
  sellerId: number;
  realPrice: number;
  price: number;
};

export type Message = {
  content?: string;
  createdAt?: string;
  messageId?: number;
  read?: boolean;
  roomId?: number;
  senderId?: number;
  message?: TransactionMessageType;
  messageType?: string;
  transactionEntity?: TransactionEntityType;
};

function unifyMessage(message: Message): UnifiedMessage {
  if ('message' in message && message.message) {
    return {
      content: message.message.content,
      createdAt: message.message.createdAt,
      messageId: message.message.messageId,
      senderId: message.message.senderId,
      read: message.message.read,
      roomId: message.message.roomId,
      transactionId: message.message.transactionId,
      messageType: message.message.messageType,
      transactionEntity: message.transactionEntity,
    };
  } else {
    return {
      content: message.content || '',
      createdAt: message.createdAt || '',
      messageId: message.messageId || 0,
      senderId: message.senderId || 0,
      read: message.read || false,
      roomId: message.roomId || 0,
      messageType: message.messageType,
      transactionEntity: message.transactionEntity,
    };
  }
}

const Chat = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { publishMessage } = useWebSocket();
  const dispatch = useDispatch();
  const chatState = useSelector((state: RootState) => state.chatStore);
  const scrollRef = useRef<HTMLDivElement>(null);
  const userId = useSelector((state: RootState) => state.userStore.userId);
  const [opponentNickname, setOpponentNickname] = useState('');
  const [opponentProfileImage, setOpponentProfileImage] = useState('');
  const messages = useSelector((state: RootState) => state.chatStore.chatInProgress) || [];
  const [userInput, setUserInput] = useState('');

  async function fetchProduct () {
    const result = await productDetail(chatState.product.productId);
    store.dispatch(setProduct(result));
}

  const fetchMessages = async () => {
    try {
      let fetchedMessages;
      if (chatState.chatInProgressType === '일반') {
        fetchedMessages = await communityChatDetail(chatState.roomId);
        dispatch(setChatInProgress(fetchedMessages));
      } else if (chatState.chatInProgressType === '거래') {
        fetchedMessages = await transactionChatDetail(chatState.roomId);
        dispatch(setProduct({...chatState.product, productId: fetchedMessages.productId}))
        dispatch(setChatInProgress(fetchedMessages.messages));
        let lastSaleState = '';
        await fetchedMessages.messages.forEach((message: any) => {
          if(message.transactionEntity) {
            lastSaleState = message.transactionEntity.saleStatus;
          }
        })
        if(lastSaleState !== '') {
          store.dispatch(setSaleStatus(lastSaleState));
        }
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const opponentInfo = async () => {
    try {
      const result = await userPage(chatState.otherId);
      setOpponentNickname(result.nickname);
      setOpponentProfileImage(result.profileImage);
    } catch (error) {
      console.error('Failed to fetch opponent info:', error);
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (chatState.roomId !== 0) {
      opponentInfo();
      fetchMessages();
    }
  }, [chatState.roomId]);
  
  useEffect(() => {
    if(chatState.product.productId !== 0) {
      fetchProduct();
    }
  }, [chatState.product.productId])

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendButton = () => {
    if (userInput.trim() !== '') {
      if (chatState.chatInProgressType === '일반') {
        publishMessage(`/pub/${chatState.roomId}/send`, { senderId: userId, content: userInput });
      } else {
        publishMessage(`/pub/transaction/${chatState.roomId}/send`, {
          senderId: userId,
          content: userInput,
          messageType: 'MESSAGE',
        });
      }
      setUserInput('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && userInput.trim() !== '') {
      handleSendButton();
    }
  };

  const unifiedMessages = messages.map(unifyMessage);

  return (
    <div
      className={`
        flex flex-col max-md:hidden fixed top-0 w-[35rem] max-w-[40rem] h-full pt-[3.2rem] lg:pt-0
        bg-light-white outline-light-border-1
        dark:bg-dark-white dark:outline-dark-border-1
        transition-all duration-300 ease-in-out outline outline-1
      `}
    >
      {/* 모달 */}
      {modalOpen && (
        <div className={`${modalOpen ? '' : 'hidden'}`}>
          <ChatTradeModal setModalOpen={setModalOpen} />
        </div>
      )}
      {/* 상대 정보 */}
      <div
        className={`flex items-center shrink-0 p-[0.8rem]
        border-light-border-1
        dark:border-dark-border-1
        border-b`}
      >
        <div
          className={`size-[2.7rem] me-[1rem]
          border-light-border
          dark:border-dark-border
          rounded-full border overflow-hidden`}
        >
          <img src={opponentProfileImage} alt="NoImg" className={`fit`} />
        </div>
        <div className={`text-lg font-medium`}>{opponentNickname}</div>
        <div className={`ms-auto cursor-pointer`} onClick={() => dispatch(setIsChatOpen(false))}>
          <CloseIcon
            className={`hidden md:block md:size-[1.8rem]
            fill-light-border-icon
            dark:fill-dark-border-icon`}
          />
        </div>
      </div>
      {/* 상품 정보 */}
      {chatState.chatInProgressType === '거래' && (
        <div>
          <ProductInfoChat setModalOpen={setModalOpen} />
        </div>
      )}
      {/* 메세지 부분 */}
      <div className="h-full ps-[0.75rem] overflow-scroll" ref={scrollRef}>
        {unifiedMessages && unifiedMessages.length > 0 ? (
          unifiedMessages.map((message) =>
            message.senderId === chatState.otherId ? (
              <div
                className={`flex justify-start items-center my-[0.75rem] pe-[20%]`}
                key={message.messageId}
              >
                <div
                  className="border-light-border size-[2.5rem] me-[0.5rem]
                  border rounded-full shadow-md"
                >
                  <img src={opponentProfileImage} alt="NoImg" />
                </div>
                {message.messageType === 'TRANSACTION' ? (
                  <div>
                    <ChatTradePropser transactionEntity={message.transactionEntity}/>
                  </div>
                ) : (
                  <div
                    className="max-w-[10rem] px-[0.8rem] py-[0.3rem]
                  bg-light-gray text-light-text
                  dark:bg-dark-gray dark:text-dark-text
                  rounded-md break-words"
                  >
                    {message.content}
                  </div>
                )}
                <div
                  className="shrink-0 mt-auto mb-[0.125rem] ms-[0.5rem] 
                  text-xs text-end"
                >
                  <div>{formatTime(message.createdAt)}</div>
                </div>
              </div>
            ) : (
              <div
                className={`flex justify-end items-center my-[1rem] ps-[20%]`}
                key={message.messageId}
              >
                <div className="shrink-0 mt-auto me-[0.5rem] text-xs text-end">
                  <div>{message.read ? '' : '1'}</div>
                  <div className="mb-[0.125rem]">{formatTime(message.createdAt)}</div>
                </div>
                {message.messageType === 'TRANSACTION' ? (
                  <div>
                    <ChatTradePropser transactionEntity={message.transactionEntity}/>
                  </div>
                ) : (
                <div
                  className="max-w-[10rem] px-[0.8rem] py-[0.3rem]
                  bg-light-signature text-light-text
                  dark:bg-dark-signature dark:text-dark-text
                  rounded-md break-words"
                >
                  {message.content}
                </div>
                )}
              </div>
            ),
          )
        ) : (
          <div></div>
        )}
      </div>

      <div
        className="flex justify-between items-center shrink-0 w-full h-[3.5rem] px-[1rem] 
        bg-light-gray
        dark:bg-dark-gray
        border-t"
      >
        <input
          className="bg-transparent focus:outline-none"
          placeholder="대화내용을 입력하세요."
          value={userInput}
          onChange={(event) => setUserInput(event.target.value)}
          onKeyDown={handleKeyPress}
        />
        <div
          className="text-center font-medium
          hover:text-light-signature
          dark:hover:text-dark-signature
          duration-150 cursor-pointer"
          onClick={handleSendButton}
        >
          전송
        </div>
      </div>
    </div>
  );
};

export default Chat;
