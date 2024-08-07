import React, { useEffect, useState } from 'react'
import { useParams, Route, Routes, useNavigate } from 'react-router-dom';
import ProfileTop from '@components/User/ProfileTop'
import MenuBar from '@components/User/MenuBar';
import FollowUsers from '@components/User/FollowUsers';

import UBoard from '@components/User/UBoard';
import UProduct from '@components/User/UProduct';
import UReview from '@components/User/UReview';

const UserPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState('게시물');
 
  const userId = Number(useParams().userId);

  useEffect(() => {
    if (selectedMenu === '게시물') {
      navigate('')
    } else if (selectedMenu === '판매/대여') {
      navigate('product')
    } else if (selectedMenu === '거래후기') {
      navigate('review')
    }
  }, [selectedMenu])

  return (
    <>
      {/* 팔로잉 모달 */}
      <div 
        onClick={() => setIsModalOpen(false)} 
        className={`
          ${isModalOpen ? 'flex' : 'hidden'} 
          md:items-center fixed z-[20] w-[100%] h-[100%] 
          bg-light-black
          dark:bg-dark-black
          bg-opacity-80
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
            setIsModalOpen={setIsModalOpen}/>
        </div>
      </div>

      {/* 유저 메인 페이지 */}
      <div className={`flex justify-center min-h-[100vh]`}>
        <div className={`w-[100%] lg:w-[54rem] bg-light-white dark:bg-dark-white p-[1.5rem] lg:p-0`}>
          <h3 className={`hidden lg:block pb-[0.75rem] text-lg md:text-[1.5rem]`}>유저 프로필</h3>
          <ProfileTop 
            userId={userId} 
            setIsModalOpen={setIsModalOpen} 
            setIsFollowing={setIsFollowing}/>
          <div>
            {/* 목록전환박스 */}
            <MenuBar 
              boardCount={1} 
              productCount={1}
              reviewCount={1}
              selectedMenu={selectedMenu} 
              setSelectedMenu={setSelectedMenu}
            />

            {/* 목록 */}
            <div className={`w-[100%] h-[14rem]`}>
              <Routes>
                <Route path='/' element={<UBoard />} />
                <Route path='/product' element={<UProduct />} />
                <Route path='/review' element={<UReview />} />
              </Routes>      
            </div>

          </div>

        </div>
      </div>
    </>
    
  )
}

export default UserPage;
