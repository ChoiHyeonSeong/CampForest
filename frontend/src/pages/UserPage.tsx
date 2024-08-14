import React, { useEffect, useState } from 'react'
import { useParams, Route, Routes, useLocation } from 'react-router-dom';
import ProfileTop from '@components/User/ProfileTop'
import MenuBar from '@components/User/MenuBar';
import FollowUsers from '@components/User/FollowUsers';

import { userPage } from '@services/userService';
import UBoard from '@components/User/UBoard';
import UProduct from '@components/User/UProduct';
import UReview from '@components/User/UReview';

import { useSelector } from 'react-redux';
import { RootState } from '@store/store';

export type UserInfo = {
  nickname: string;
  followingCount: number;
  followerCount: number;
  introduction: string;
  profileImage: string;
  temperature: number;
  isOpen: boolean;
}

const UserPage = () => {
  const currentLoc = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState<string | null>('게시물');
 
  const params = useParams()
  const userId = Number(params.userId);
  const userState = useSelector((state: RootState) => state.userStore);

  const [userinfo, setUserInfo] = useState<UserInfo>();

  const fetchUserInfo = async () => {
    try {
      const userData = await userPage(userId);
      console.log(userData)
      setUserInfo(userData);
    } catch (error) {
      console.error("Failed to fetch user info: ", error);
    }
  }

  useEffect(() => {
    fetchUserInfo();
  }, [userId]);


  useEffect(() => {
    if (currentLoc.pathname.endsWith('/product')) {
      setSelectedMenu('판매/대여')
    } else if (currentLoc.pathname.endsWith('/review')) {
      setSelectedMenu('거래후기')
    } else {
      setSelectedMenu('게시물')
    }
  }, [currentLoc.pathname])

  const isCurrentUser = userState.userId === userId;
  
  return (
    <>
      {/* 팔로잉 모달 */}
      <div 
        onClick={() => setIsModalOpen(false)} 
        className={`
          ${isModalOpen ? 'flex' : 'hidden'} 
          md:items-center fixed z-[20] w-[100%] h-[100%] 
          bg-light-black bg-opacity-80
          dark:bg-dark-black dark:bg-opacity-80
        `}
      >
        <div 
          onClick={(event) => event.stopPropagation()}
          className={`md:w-[30rem] h-[100%] md:h-[50%] md:min-h-[30rem] md:mx-auto`} 
        >
          <FollowUsers
            userId={userId}
            isModalOpen={isModalOpen}
            isFollowing={isFollowing} 
            setIsModalOpen={setIsModalOpen}
            fetchUserInfo={fetchUserInfo}  
          />
        </div>
      </div>

      {/* 유저 메인 페이지 */}
      <div className={`flex justify-center min-h-screen bg-light-white dark:bg-dark-text-white`}>
        <div
          className={`
            w-[100%] lg:w-[50rem] lg:mt-[2rem] max-sm:py-0 max-lg:px-[1.25rem] max-lg:py-[0.75rem]
          `}
        >
          <h3
            className={`
              hidden md:block pb-[0.75rem] text-lg md:text-[1.5rem] ps-[1rem] pt-[1rem]
              dark:bg-dark-white dark:bg-opacity-80
              rounded-t-lg
            `}
          >
            {isCurrentUser ? (
              <span className='font-medium'>마이프로필</span>
            ) : (
              <>
                <span className='font-medium'>{userinfo?.nickname}</span>님의 프로필
              </>
            )}
          </h3>

          <div className='px-[0.5rem] py-[1rem] mb-[0.75rem] rounded'>
            <ProfileTop
              setIsModalOpen={setIsModalOpen} 
              setIsFollowing={setIsFollowing}
              userinfo={userinfo}
              fetchUserInfo={fetchUserInfo}
            />
          </div>
          <div>
            {/* 목록전환박스 */}
            <MenuBar
              selectedMenu={selectedMenu} 
            />

            {/* 목록 */}
            <div className={`w-[100%]`}>
              <Routes>
                <Route path='/' element={<UBoard />} />
                <Route path='/product' element={<UProduct />} />
                <Route path='/review' element={<UReview userId={userId} />} />
              </Routes>
            </div>

          </div>

        </div>
      </div>
    </>
    
  )
}

export default UserPage;
