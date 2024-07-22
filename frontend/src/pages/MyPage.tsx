import React from 'react'
import { Route, Routes } from 'react-router-dom';
import ProfileImgEX from '@assets/icons/profileimg1.png'
import MenuBar from '@components/User/MenuBar';
import Board from '@components/Board/Board';

function MyPage() {
  return (
    <div className='flex justify-center min-h-screen'>
      <div className='bg-white md:p-6 w-full xl:w-[55rem] rounded-lg'>
        <h3 className='pb-[0.75rem] text-lg md:text-[1.5rem] hidden lg:block'>마이프로필</h3>
        <div className='p-6'>
          <div className='flex'>
            {/* 프로필사진 */}
            <div className="relative size-20 md:size-24 rounded-full border-[0.1rem] me-6">
                <img src={ProfileImgEX} alt="프로필 사진" className="absolute rounded-full" />
                <div className='cursor-pointer opacity-0 hover:opacity-100 duration-200 absolute w-full h-full rounded-full mx-auto bg-[#00000098] text-white'>
                  <p className='flex justify-center items-center h-full'>사진변경</p>
                </div>
            </div>
            {/* 닉네임, 팔로우, 프로필 수정 */}
            <div className='py-3 w-[calc(100%-6rem)] md:w-[calc(100%-7rem)] lg:w-[calc(100%-8rem)]'>
              <div className='flex justify-between'>
                <div className='font-medium md:text-lg'>사용자닉네임</div>
                <div className='font-light text-xs md:text-sm lg:text-base mt-2 cursor-pointer'>프로필 수정하기 ›</div>
              </div>

              <div className=" mt-1">
                <div className="text-gray-700 inline-block md:text pr-3">팔로워
                  <span className='font-medium ms-2 cursor-pointer'>111</span>
                </div>
                <div className="text-gray-700 inline-block md:text">팔로잉
                  <span className='font-medium ms-2 cursor-pointer'>286</span>
                </div>
              </div>

            </div>
          </div>

          {/* 자기소개 */}
          <div className='lg:text-lg mt-4 ms-2'>자기소개를 적는 곳입니다.</div>

          {/* 거래불꽃온도 */}
          <div className='ms-2 mt-6 mb-3'>
            <div className='mb-2 font-medium'>거래불꽃온도</div>
            <div className="w-1/2 h-3 bg-gray-200 rounded-full">
              <div className="h-full rounded-full w-1/2 bg-gradient-to-r from-red-500 to-orange-400"></div>
            </div>
          </div>
        </div>
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