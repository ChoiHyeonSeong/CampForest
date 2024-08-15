import { ChatUserType } from '@components/Chat/ChatUser';
import { communityChatList, initCommunityChat } from '@services/chatService';
import { addMessageToChatInProgress, selectCommnunity, setChatInProgressType, setCommunityChatUserList, setCommunityUnreadCount, setIsChatOpen, setOtherId, setRoomId, updateCommunityChatUserList, updateMessageReadStatus } from '@store/chatSlice';
import { RootState, store } from '@store/store';
import { useWebSocket } from 'Context/WebSocketContext';
import { useDispatch, useSelector } from 'react-redux';

type Props = {
  userId: number;
}

const ChatBtn = (props: Props) => {
  const dispatch = useDispatch();
  const { subscribe, publishMessage } = useWebSocket();
  const chatState = useSelector((state: RootState) => state.chatStore);
  const loginUserId = Number(sessionStorage.getItem('userId'));

  async function handleChatButton() {
    const matchedUser = chatState.communityChatUserList.find((chatUser) => chatUser.otherUserId === props.userId);
    if (matchedUser) {
      dispatch(setChatInProgressType('일반'))
      dispatch(selectCommnunity());
      dispatch(setOtherId(matchedUser.otherUserId));
      dispatch(setRoomId(matchedUser.roomId));
      dispatch(setIsChatOpen(true));
    } else {
      try {
        const roomId = await initCommunityChat(props.userId);
        await fetchCommunityChatList()
        dispatch(setChatInProgressType('일반'))
        dispatch(selectCommnunity());
        dispatch(setOtherId(props.userId));
        dispatch(setIsChatOpen(true));
        dispatch(setRoomId(roomId));
  
        // roomId가 확실히 업데이트된 후에 subscribe 함수 호출
        subscribeToChat(roomId);
      } catch (error) {
        console.error("Error in handleChatButton:", error);
      }
    }
  }

  // 일반 채팅방 목록 가져오기
  const fetchCommunityChatList = async () => {
    const userId = store.getState().userStore.userId;
    if (userId) {
      const response = await communityChatList();
      let count = 0;
      response.forEach((chatUser: ChatUserType) => {
        count += chatUser.unreadCount;
      })
      store.dispatch(setCommunityUnreadCount(count));
      store.dispatch(setCommunityChatUserList(response));
    }
  }

  function subscribeToChat(roomId: number) {
    // 메세지를 받았을 때
    subscribe(`/sub/community/${roomId}`, (message: { body: string }) => {
      const response = JSON.parse(message.body);
      const state: RootState = store.getState();
      if(response.type === 'READ') {
        if (state.userStore.userId !== response.senderId) {
          store.dispatch(updateMessageReadStatus({ roomId: roomId, readerId: response.senderId }));
        }  
      }
      else if (state.chatStore.roomId === response.roomId) {
        dispatch(updateCommunityChatUserList({...response, inProgress: true}));
        publishMessage(`/pub/room/${response.roomId}/markAsRead`, loginUserId);
        dispatch(addMessageToChatInProgress(response));
      } else {
        dispatch(updateCommunityChatUserList({...response, inProgress: false}));
      }
    });

  }

  return (
    <div 
      onClick={handleChatButton}
      className={`
        px-[0.75rem] md:px-[1rem] py-[0.25rem]
        bg-light-gray-1
        dark:bg-dark-gray-1
        rounded-md cursor-pointer text-[100%]
      `}
    >
      채팅
    </div>
  )
}

export default ChatBtn