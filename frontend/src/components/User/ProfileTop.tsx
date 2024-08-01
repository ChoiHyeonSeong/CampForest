import React, { useEffect, useState } from 'react';
import defaultImage from '@assets/logo192.png';
import FireGif from '@assets/images/fire.gif';
import { Link } from 'react-router-dom';
import { userPage } from '@services/userService';
import { setIsLoading } from '@store/modalSlice';
import { useDispatch } from 'react-redux';

type UserInfo = {
  nickname: string;
  followingCount: number;
  followerCount: number;
  introduction: string;
  profileImage: string;
  isOpen: boolean;
}

type Props = {
  userId: number;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFollowing: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ProfileTop({ userId, setIsModalOpen, setIsFollowing }: Props) {
  const dispatch = useDispatch();
  const [userinfo, setUserInfo] = useState<UserInfo>();
  const [myPage, setMyPage] = useState(false);
  const loginUserId = Number(sessionStorage.getItem('userId'));

  useEffect(() => {
    if (userId === loginUserId) {
      setMyPage(true);
    } else {
      setMyPage(false);
    }
    async function fetchUserInfo() {
      try {
        const userData = await userPage(userId);
        setUserInfo(userData);
      } catch (error) {
        console.error("Failed to fetch user info: ", error);
      }
    }

    fetchUserInfo();
  }, [])

  return (
    <div className={`px-[1rem] py-[1.5rem`}>
      <div className={`flex`}>
        {/* 프로필사진 */}
        <div 
          className={`
            relative size-[4rem] md:size-[5rem] me-[1.5rem]
            border-light-border
            dark:border-dark-border
            rounded-full border-[0.1rem]
          `}
        >
          <img 
            src={userinfo?.profileImage ? userinfo.profileImage : defaultImage} 
            alt='' 
            className={`
              absolute rounded-full
            `}
          />
          <div 
            className={`
              absolute w-full h-full rounded-full mx-auto 
              bg-light-black text-light-white
              dark:bg-dark-black dark:text-dark-white
              cursor-pointer opacity-60 hover:opacity-100 duration-200 
            `}
          >
            <p className={`flex justify-center items-center h-full`}>
              사진변경
            </p>
          </div>
        </div>

        {/* 닉네임, 팔로우, 프로필 수정 */}
        <div className={`w-[calc(100%-6rem)] md:w-[calc(100%-7rem)] lg:w-[calc(100%-8rem)] py-[0.75rem]`}>
          <div className={`flex justify-between`}>
            <div className={`flex`}>
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
                  ${myPage ? 'hidden' : '  ' }
                  flex
                `}
              >
                <div 
                  className={`
                    me-[0.5rem] px-[0.75rem] md:px-[1rem] py-[1rem]
                    bg-light-signature text-light-white
                    dark:bg-dark-signature dark:text-dark-white
                    text-xs md:text-base cursor-pointer rounded-md
                  `}
                >
                  팔로우
                </div>
                <div 
                  className={`
                    px-[0.75rem] md:px-[1rem] py-[0.25rem]
                    bg-light-gray-1
                    text-xs md:text-base rounded-md cursor-pointer
                  `}
                >
                  채팅
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
          lg:text-lg 
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
              653
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
              relative w-1/2 h-full 
              bg-gradient-to-r from-light-warning to-light-signature
              dark:from-dark-warning dark:to-dark-signature
              rounded-full
            `}
          >
            <img 
              src={FireGif} 
              alt="불꽃" 
              className={`absolute -right-[4rem] -top-[3.75rem] size-[8rem]`}/>
          </div>
        </div>
      </div>
    </div>
  )
}