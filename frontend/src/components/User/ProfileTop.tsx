import React, { useEffect, useRef, useState } from 'react';
import defaultImage from '@assets/images/basic_profile.png';
import FireGif from '@assets/images/fire.gif';
import { Link, useParams } from 'react-router-dom';

import FollowBtn from './FollowBtn';
import ChatBtn from './ChatBtn';

type UserInfo = {
  nickname: string;
  followingCount: number;
  followerCount: number;
  introduction: string;
  profileImage: string;
  temperature: number;
  isOpen: boolean;
}

type Props = {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFollowing: React.Dispatch<React.SetStateAction<boolean>>;
  userinfo: UserInfo | undefined;
  fetchUserInfo: () => void;
}

export default function ProfileTop({ setIsModalOpen, setIsFollowing, userinfo, fetchUserInfo }: Props) {
  const userId = Number(useParams().userId);
  const [myPage, setMyPage] = useState(false);
  const loginUserId = Number(sessionStorage.getItem('userId'));

  useEffect(() => {
    if (userId === loginUserId) {
      setMyPage(true);
    } else {
      setMyPage(false);
    }
    fetchUserInfo();
  }, [userId])
  
  let percentage: number = 50;
  if (userinfo) {
    percentage = Math.min(Math.max(Math.round((userinfo.temperature / 1400) * 100), 0), 100);
  }

  return (
    <div
      className={`
        w-full
        dark:bg-dark-white dark:bg-opacity-80
      `}
    >
      <div className={`flex items-center`}>
        {/* 프로필사진 */}
        <div 
          className={`
            flex items-center justify-center relative size-[3.6rem] sm:size-[5rem] me-[1rem]
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
        <div className={`w-[calc(100%-6rem)] md:w-[calc(100%-7rem)] lg:w-[calc(100%-8rem)] py-[0.5rem]`}>
          <div className={`flex justify-between`}>
            <div className={`flex items-center`}>
              <div 
                className={`
                  me-[1.25rem]
                  font-semibold text-[1.1rem] md:text-lg 
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
                <div className='me-[0.5rem] text-xs md:text-base'>
                  <FollowBtn targetUserId={userId} callbackFunction={fetchUserInfo}/>
                </div>
                <div 
                  className={`
                    text-xs md:text-base
                  `}
                >
                  <ChatBtn userId={userId} />
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
              className={`inline-block pe-[0.75rem] cursor-pointer`}
            >
              팔로워
              <span 
                className={`
                  ms-[0.5rem]
                  font-medium
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
              className={`inline-block cursor-pointer`}
            >
              팔로잉
              <span 
                className={`
                   ms-[0.5rem]
                  font-medium
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
      <div className={`w-full my-[1rem] px-[0.5rem]`}>
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
              {userinfo?.temperature}
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
              className={`absolute -right-[4rem] -top-[4.5rem] z-[0] w-[128px] min-w-[128px] h-[160px] min-h-[160px] no-drag`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}