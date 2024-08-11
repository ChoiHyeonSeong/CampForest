import ChatUser, { ChatUserType } from './ChatUser';
import TransactionChatUser from './TransactionChatUser';
import Chat from './Chat';
import { RootState } from '@store/store';
import { useDispatch, useSelector } from 'react-redux';
import { setChatInProgress, setChatInProgressType, setIsChatOpen, setOtherId, setRoomId, updateCommunityChatUserList, updateTransactionChatUserList } from '@store/chatSlice';
import { useWebSocket } from 'Context/WebSocketContext';

type Props = {
  isLogin: boolean;
  userId: number;
}

const ChatUserList = (props: Props) => {
  const { publishMessage } = useWebSocket();
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.userStore);
  const chatState = useSelector((state: RootState) => state.chatStore);

  const handleChatUser = async (communityChatUser: ChatUserType) => {
    if(communityChatUser.roomId !== chatState.roomId) {
      dispatch(setChatInProgress([]));
      dispatch(setRoomId(communityChatUser.roomId));
      dispatch(setChatInProgressType('일반'));
    }
    dispatch(setOtherId(communityChatUser.otherUserId));
    // 읽음 처리
    publishMessage(`/pub/room/${communityChatUser.roomId}/markAsRead`, '');
    dispatch(updateCommunityChatUserList({
      roomId: communityChatUser.roomId,
      content: communityChatUser.lastMessage,
      createdAt: communityChatUser.lastMessageTime,
      inProgress: true,
    }))
    dispatch(setIsChatOpen(true));
  }

  const handleTransactionChatUser = async (transactionChatUser: ChatUserType) => {
    if(transactionChatUser.roomId !== chatState.roomId) {
      dispatch(setChatInProgress([]));
      dispatch(setRoomId(transactionChatUser.roomId));
      dispatch(setChatInProgressType('거래'));
    }
    dispatch(setOtherId(transactionChatUser.otherUserId));
    // 읽음 처리
    publishMessage(`/pub/transaction/${transactionChatUser.roomId}/markAsRead`, '');
    // 채팅 유저 목록 업데이트
    dispatch(updateTransactionChatUserList({
      roomId: transactionChatUser.roomId,
      content: transactionChatUser.lastMessage,
      createdAt: transactionChatUser.lastMessageTime,
      inProgress: true,
    }))
    dispatch(setIsChatOpen(true));
  }

  return (
    <div 
      className='max-h-[calc(100%-7.5rem)]
      bg-light-white
      dark:bg-dark-white
      overflow-auto
      '
    >
      {/* 일반 채팅 */}
      <div className={`${chatState.selectedCategory === '일반' ? '' : 'hidden'}`}>
        {chatState.communityChatUserList.map((communityChatUser, key) => (
          <div
            key={key}
            className='
              bg-light-white
              dark:bg-dark-white
            ' 
            onClick={
              () => handleChatUser(
                communityChatUser
              )
            }
          >
            <ChatUser index={key}/>
          </div>
        ))}
      </div>
      {/* 거래 채팅 */}
      <div className={`${chatState.selectedCategory === '거래' ? '' : 'hidden'}`}>
      {chatState.transactionChatUserList.map((transactionChatUser, index) => (
          <div
            className='
              bg-light-white
              dark:bg-dark-white
            ' 
            onClick={
              () => handleTransactionChatUser(
                transactionChatUser
              )
            }
          >
            <TransactionChatUser index={index}/>
          </div>
        ))}
      </div>
      <div
        className={`
          ${chatState.isChatOpen ? 'translate-x-[20rem]' : '-translate-x-full'} 
          max-md:hidden absolute top-0 -z-[135] w-[35rem] max-w-[40rem] h-full pt-[3.2rem] lg:pt-0
          bg-light-white outline-light-border-1
          dark:bg-dark-white dark:outline-dark-border-1
          transition-all duration-300 ease-in-out outline outline-1
        `}
      >
        <Chat />
      </div>
      
    </div >
  )
}

export default ChatUserList;