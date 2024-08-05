import React, { useEffect, useRef, useState } from 'react';

import { ReactComponent as CloseIcon } from '@assets/icons/close.svg';
import userImage from '@assets/logo192.png'
import { RootState } from '@store/store';
import { useDispatch, useSelector } from 'react-redux';
import { communityChatDetail } from '@services/communityChatService';
import { userPage } from '@services/userService';
import { useWebSocket } from 'Context/WebSocketContext';
import { setChatInProgress } from '@store/chatSlice';

export type Message = {
  messageId: number;
  content: string;
  senderId: number;
  roomId: number;
  createdAt: string;
  read: boolean;
}

type Props = {
  otherId: number;
  setIsOpenChat: React.Dispatch<React.SetStateAction<boolean>>;
}

const Chat = ({otherId, setIsOpenChat}: Props) => {
  const { sendMessage } = useWebSocket();
  const dispatch = useDispatch();
  const scrollRef = useRef<HTMLDivElement>(null); 
  const roomId = useSelector((state: RootState) => state.chatStore.roomId);
  const userId = useSelector((state: RootState) => state.userStore.userId);
  const [opponentNickname, setOpponentNickname] = useState('');
  const messages = useSelector((state: RootState) => state.chatStore.chatInProgress);
  const [userInput, setUserInput] = useState('');
  const fetchMessages = async () => {
    dispatch(setChatInProgress(await communityChatDetail(roomId)));
  }
  const opponentInfo = async () => {
    const result = await userPage(otherId);
    console.log(result);
    setOpponentNickname(result.nickname);
  }

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if(roomId !== 0){
      opponentInfo();
      fetchMessages();
    }
    
  }, [roomId])

  useEffect(() => {
    scrollToBottom();
  }, [messages])

  const handleSendButton = () => {
    sendMessage(`/pub/${roomId}/send`, { senderId: userId, content: userInput });
    setUserInput('');
  }
  

  return (
    // 데스크탑, 태블릿
    <div 
      className={`
        max-md:hidden fixed relative top-0 z-[35] w-[35rem] max-w-[40rem] h-full pt-[3.2rem] lg:pt-0
        bg-light-white outline-light-border-1
        dark:bg-dark-white dark:outline-dark-border-1
        transition-all duration-300 ease-in-out outline outline-1
      `}
    >
      <div 
        className={`
          flex items-center mx-[2rem] py-[1rem]
          border-light-border
          dark:border-dark-border
          border-b
        `}
      >
        <div 
          className={`
            size-[3rem] me-[1rem]
            border-light-border
            dark:border-dark-border
            rounded-full border
          `}
        >
          <img 
            src={userImage} 
            alt="NoImg" 
            className={`fit`}
          />
        </div>
        <div className={`text-lg`}>
          {opponentNickname}
        </div>
        <div className={`ms-auto`}>
          <CloseIcon 
            className={`
              hidden md:block md:size-[2rem]
              fill-light-black
              dark:fill-dark-black
            `}
          />
        </div>
      </div>
      <div 
        className='h-[50rem] overflow-scroll'
        ref={scrollRef}
      >
        {messages.map((message) => (
          message.senderId === otherId ? (
            <div
              className={`
                flex justify-start items-center
              `}
            >
              <div 
                className='
                  ms-[0.75rem] my-[0.5rem] p-[1rem]
                  bg-light-gray
                  dark:bg-dark-gray   
                  rounded-lg
                '
              >
                {message.content}
              </div>
              <div>
                <div className='text-sm'>
                  {message.read ? '읽음' : '안 읽음'}
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`
                flex justify-end items-center
              `}
            >
              <div className='text-sm'>
                {message.read ? '읽음' : '안 읽음'}
              </div>
              <div
                className='
                  my-[0.5rem] p-[1rem]
                  bg-light-signature
                  dark:bg-dark-signature
                  rounded-lg
                '
              >
                {message.content}
              </div>
            </div>
          )
        ))}
      </div>
      <div 
        className='
          flex items-center fixed bottom-0 z-[10] w-full h-[3rem] px-[1rem] 
          border-t
        '
      >
        <input 
          className='
            w-5/6
            focus:outline-none
          '
          value={userInput}
          onChange={(event) => (setUserInput(event.target.value))} 
        />
        <div 
          className='
            w-1/6 
            text-center
          '
          onClick={() => handleSendButton()}
        >
          전송
        </div>
      </div>
    </div>
  )
}

export default Chat;