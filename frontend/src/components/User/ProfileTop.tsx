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
    <div className='px-4 py-6'>
          <div className='flex'>
            {/* 프로필사진 */}
            <div className="relative size-16 md:size-20 rounded-full border-[0.1rem] me-6">
                <img src={userinfo?.profileImage ? userinfo.profileImage : defaultImage} alt='' className="absolute rounded-full" />
                <div className='cursor-pointer opacity-0 hover:opacity-100 duration-200 absolute w-full h-full rounded-full mx-auto bg-[#00000098] text-white'>
                  <p className='flex justify-center items-center h-full'>사진변경</p>
                </div>
            </div>

            {/* 닉네임, 팔로우, 프로필 수정 */}
            <div className='py-3 w-[calc(100%-6rem)] md:w-[calc(100%-7rem)] lg:w-[calc(100%-8rem)]'>
              <div className='flex justify-between'>
                <div className='flex'>
                  <div className='font-medium text-sm md:text-lg me-5'>{userinfo?.nickname}</div>
                  <div className={`${myPage ? 'hidden' : '  ' } flex`}>
                    <div className='px-3 md:px-4 py-1 text-xs md:text-base bg-orange-400 text-white rounded-md me-2 cursor-pointer'>팔로우</div>
                    <div className='px-3 md:px-4 py-1 text-xs md:text-base bg-gray-300 rounded-md cursor-pointer'>채팅</div>
                  </div>
                </div>
                
                <Link to='/user/profile/edit' className={`${myPage ? '' : 'hidden'} font-light text-xs md:text-sm lg:text-base mt-2 cursor-pointer`}>프로필 수정하기</Link>
              </div>

              <div className="mt-2">
                <div onClick={() => {
                  setIsModalOpen(true)
                  setIsFollowing(false)
                  }} className="text-gray-700 inline-block md:text pr-3">팔로워
                  <span className='font-medium ms-2 cursor-pointer'>{userinfo?.followerCount}</span>
                </div>
                <div onClick={() => {
                  setIsModalOpen(true)
                  setIsFollowing(true)
                  }} className="text-gray-700 inline-block md:text">팔로잉
                  <span className='font-medium ms-2 cursor-pointer'>{userinfo?.followingCount}</span>
                </div>
              </div>

            </div>
          </div>

          {/* 자기소개 */}
          <div className='lg:text-lg mt-4 ms-2'>{userinfo?.introduction}</div>

          {/* 거래불꽃온도 */}
          <div className='ms-2 mt-6 mb-3 w-full'>
            <div className='flex'>
              <div className='mb-2 font-medium'>거래불꽃온도</div>
              <div className='ms-3 text-red-500 font-medium'><span>653</span>℃</div>
            </div>
            
            <div className="w-full h-4 bg-gray-200 rounded-full">
              <div className="h-full rounded-full w-1/2 bg-gradient-to-r from-red-500 to-orange-400 relative">
                <img src={FireGif} alt="불꽃" className="absolute -right-16 -top-[3.75rem] size-32"/>
              </div>
            </div>
          </div>
        </div>
  )
}