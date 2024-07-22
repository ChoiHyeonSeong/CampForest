import React from 'react'
import { Route, Routes } from 'react-router-dom';
import ProfileTop from '@components/User/ProfileTop'
import MenuBar from '@components/User/MenuBar';
import Board from '@components/Board/Board';

function MyPage() {
  return (
    <div className='flex justify-center min-h-screen'>
      <div className='bg-white md:p-6 w-full xl:w-[55rem] rounded-lg'>
        <h3 className='pb-[0.75rem] text-lg md:text-[1.5rem] hidden lg:block'>XXX 프로필</h3>
        <ProfileTop />
        <div>
          {/* 목록전환박스 */}
          <MenuBar />

          {/* 목록 */}
          <div className='w-full h-56'>
            <Routes>
              <Route path='/' element={<Board />} />
            </Routes>
          </div>

        </div>

      </div>
    </div>
  )
}

export default MyPage