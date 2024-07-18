import React from 'react'
import InterestSetting from './InterestSetting'

import ProfileImg from '@assets/icons/profileimg.png'

const UserInformation = () => {

  return (
    <form className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-6 w-full md:max-w-3xl lg:w-[40rem] lg:p-0">

        {/* 프로필사진 */}
        <div className="flex justify-center mb-10">
          <div className="relative w-28 h-28 rounded-full mx-auto border-[0.1rem]">
            <img src={ProfileImg} alt="프로필 사진" className="absolute w-24 h-24 rounded-full bottom-0 left-2" />
            <div className='cursor-pointer opacity-0 hover:opacity-100 duration-200 absolute w-full h-full rounded-full mx-auto bg-[#00000098] text-white'>
              <p className='flex justify-center items-center h-full'>사진변경</p>
            </div>
          </div>
        </div>

        {/* 닉네임 */}
        <div className="mb-6">
          <label className="block text-gray-700 text-left font-medium text-lg">닉네임</label>
          <input type="text" className="w-full px-4 py-2 border-b focus:outline-none border-[#cccccc] placeholder-slate-400 focus:ring-0" placeholder='닉네임을 입력해주세요(최대 8자).'></input>
        </div>

        {/* 자기소개 */}
        <div className="mb-6">
          <label className="block text-gray-700 text-left font-medium text-lg">자기소개</label>
          <input type="text" className="w-full px-4 py-2 border-b-[0.1rem] focus:outline-none border-[#cccccc] placeholder-slate-400 focus:ring-0" placeholder='자기소개를 입력해주세요.'></input>
        </div>

        {/* 관심사 설정 */}
        <InterestSetting />
      </div>
    </form>
  )
}

export default UserInformation