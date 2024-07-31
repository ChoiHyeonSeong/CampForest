import React, { useEffect, useState } from 'react'
import { Routes } from 'react-router-dom';
import ProfileTop from '@components/User/ProfileTop'
import MenuBar from '@components/User/MenuBar';
import FollowUsers from '@components/User/FollowUsers';

const MyPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(true);

  return (
    <div className='flex justify-center min-h-screen'>
      
      <div 
        onClick={() => setIsModalOpen(false)} 
        className={`${isModalOpen ? '' : 'hidden'} z-10 fixed md:items-center w-full h-full bg-black bg-opacity-70 flex`}>
        <div className="h-full md:min-h-[30rem] md:w-[40rem] md:h-[50%] md:mx-auto" onClick={(event) => event.stopPropagation()}>
          <FollowUsers isFollowing={isFollowing} setIsModalOpen={setIsModalOpen}/>
        </div>
      </div>
      <div className='bg-white md:p-6 w-full xl:w-[55rem] rounded-lg'>
        <h3 className='pb-[0.75rem] text-lg md:text-[1.5rem] hidden lg:block'>마이 프로필</h3>
        <ProfileTop setIsModalOpen={setIsModalOpen} setIsFollowing={setIsFollowing}/>
        <div>
          {/* 목록전환박스 */}
          <MenuBar />

          {/* 목록 */}
          <div className='w-full h-56'>
            <Routes>
            </Routes>
          </div>

        </div>

      </div>
    </div>
  )
}

export default MyPage
