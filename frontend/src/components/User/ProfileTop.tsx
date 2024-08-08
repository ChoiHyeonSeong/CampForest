import React, { useEffect, useState } from 'react';
import defaultImage from '@assets/images/basic_profile.png';
import FireGif from '@assets/images/fire.gif';
import { Link, useParams } from 'react-router-dom';
import { userPage } from '@services/userService';
import { useDispatch, useSelector } from 'react-redux';

import FollowBtn from './FollowBtn';
import ChatBtn from './ChatBtn';
import { RootState } from '@store/store';
import { setChatInProgress, setIsChatOpen, setOtherId, setRoomId, updateCommunityChatUserList, updateMessageReadStatus } from '@store/chatSlice';
import { initCommunityChat } from '@services/communityChatService';
import { useWebSocket } from 'Context/WebSocketContext';

type UserInfo = {
  nickname: string;
  followingCount: number;
  followerCount: number;
  introduction: string;
  profileImage: string;
  isOpen: boolean;
}

type Props = {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFollowing: React.Dispatch<React.SetStateAction<boolean>>;
  userinfo: UserInfo | undefined;
  fetchUserInfo: () => void;
}

export default function ProfileTop({ setIsModalOpen, setIsFollowing, userinfo, fetchUserInfo }: Props) {
  const dispatch = useDispatch();
  const chatState = useSelector((state: RootState) => state.chatStore);
  const userId = Number(useParams().userId);
  const [myPage, setMyPage] = useState(false);
  const loginUserId = Number(sessionStorage.getItem('userId'));
  const { subscribe, sendMessage } = useWebSocket();

  const [fireTemperature, setFireTemperature] = useState(400);

  useEffect(() => {
    if (userId === loginUserId) {
      setMyPage(true);
    } else {
      setMyPage(false);
    }
    fetchUserInfo();
  }, [userId])

  const percentage = Math.min(Math.max(Math.round((fireTemperature / 1400) * 100), 0), 100);

  const handleChatButton = async () => {
    const matchedUser = chatState.communityChatUserList.find((chatUser) => chatUser.otherUserId === userId);
  
    if (matchedUser) {
      dispatch(setOtherId(matchedUser.otherUserId));
      dispatch(setRoomId(matchedUser.roomId));
      dispatch(setIsChatOpen(true));
    } else {
      try {
        const roomId = await initCommunityChat(userId);
        console.log('방번호', roomId);
        // 읽음 처리를 받았을 때
        subscribe(`/sub/community/${roomId}/readStatus`, (message) => {
          const readerId = JSON.parse(message.body); // 읽은 사람 Id

          if (loginUserId !== readerId) {
            dispatch(updateMessageReadStatus({ roomId: roomId, readerId }));
          }  
        });
        // 메세지를 받았을 때
        subscribe(`/sub/community/${roomId}`, (message) => {
          const response = JSON.parse(message.body);

          if (chatState.roomId === response.roomId) {
            dispatch(updateCommunityChatUserList({...response, inProgress: true}));
            sendMessage(`/pub/room/${response.roomId}/markAsRead`, userId);
            dispatch(setChatInProgress([...chatState.chatInProgress, response]));
          } else {
            dispatch(updateCommunityChatUserList({...response, inProgress: false}));
          }
        })
        dispatch(setOtherId(userId));
        dispatch(setRoomId(roomId));
        dispatch(setIsChatOpen(true));
      } catch (error) {

      }
    }
  }

  return (
    <div className={`px-[1rem] py-[1.5rem`}>
      <div className={`flex`}>
        {/* 프로필사진 */}
        <div 
          className={`
            flex items-center justify-center relative size-[4rem] md:size-[5rem] me-[1.5rem]
            border-light-border
            dark:border-dark-border
            rounded-full border-[0.1rem] overflow-hidden
          `}
        >
          <img 
            src={userinfo?.profileImage ? userinfo.profileImage : defaultImage} 
            alt='' 
            className={`
              absolute rounded-full w-full
            `}
          />
        </div>

        {/* 닉네임, 팔로우, 프로필 수정 */}
        <div className={`w-[calc(100%-6rem)] md:w-[calc(100%-7rem)] lg:w-[calc(100%-8rem)] py-[0.75rem]`}>
          <div className={`flex justify-between`}>
            <div className={`flex items-center`}>
              <div 
                className={`
                  me-[1.25rem]
                  font-medium text-sm md:text-lg 
                `}
              >
                {userinfo?.nickname}
              </div>
              <div 
                className={`
                  ${myPage || !loginUserId  ? 'hidden' : '' }
                  flex
                `}
              > 
                <div className='text-sm md:text-base'>
                  <FollowBtn targetUserId={userId} callbackFunction={fetchUserInfo}/>
                </div>
                <div 
                  className={`
                    text-sm md:text-base
                  `}
                >
                  <ChatBtn handleChatButton={handleChatButton}/>
                </div>
              </div>
            </div>
            
            <Link 
              to='/user/profile/edit' 
              className={`
                ${myPage ? '' : 'hidden'} 
                mt-[0.5rem]
                font-light text-xs md:text-sm lg:text-base cursor-pointer
              `}
            >
              프로필 수정하기
            </Link>
          </div>

          <div className={`mt-[0.5rem]`}>
            <div 
              onClick={() => {
                setIsModalOpen(true)
                setIsFollowing(false)
              }} 
              className={`inline-block pe-[0.75rem]`}
            >
              팔로워
              <span 
                className={`
                  ms-[0.5rem]
                  font-medium cursor-pointer
                `}
              >
                {userinfo?.followerCount}
              </span>
            </div>
            <div 
              onClick={() => {
                setIsModalOpen(true)
                setIsFollowing(true)
              }} 
              className={`inline-block`}
            >
              팔로잉
              <span 
                className={`
                   ms-[0.5rem]
                  font-medium cursor-pointer
                `}
              >
                {userinfo?.followingCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 자기소개 */}
      <div 
        className={`
          mt-[1rem] ms-[0.5rem]
          break-all
        `}
      >
        {userinfo?.introduction}
      </div>
      {/* 거래불꽃온도 */}
      <div className={`w-full mt-[1.5rem] mb-[0.75rem] ms-[0.5rem]`}>
        <div className={`flex`}>
          <div 
            className={`
              mb-[0.5rem] 
              font-medium
            `}
          >
            거래불꽃온도
          </div>
          <div 
            className={`
              ms-[0.75rem] 
              text-light-warning
              dark:text-dark-warning
              font-medium
            `}
          >
            <span>
              {fireTemperature}
            </span>
            ℃
          </div>
        </div>
        
        <div 
          className={`
            w-full h-[1rem] 
            bg-light-gray-1 
            dark:bg-dark-gray-1
            rounded-full
          `}
        >
          <div 
            className={`
              relative h-full 
              bg-gradient-to-r from-light-warning to-light-signature
              dark:from-dark-warning dark:to-dark-signature
              rounded-full
            `}
            style={{ 
              width: `${percentage}%` 
            }}
          >
            <img 
              src={FireGif} 
              alt="불꽃" 
              className={`absolute -right-[4rem] -top-[4.5rem] z-[0] w-[128px] min-w-[128px] h-[160px] min-h-[160px]`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}