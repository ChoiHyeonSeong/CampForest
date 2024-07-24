import React from 'react';
import ProfileImgEX from '@assets/images/profileimg1.png'

const FollowUser = () => {
  return (
    <div className='md:mx-3 py-3 border-b flex'>
      <img src={ProfileImgEX} alt="프로필 사진" className="size-16 rounded-full" />
      <div className='ms-2 flex flex-col justify-center'>
        <div className='font-bold'>사용자 아이디</div>
        <div className='text-[#999999]'>닉네임</div>
      </div>
      <div className='ms-auto flex items-center'>
        <button className='rounded-md bg-[#CCCCCC] py-1 px-2'>삭제</button>
      </div>
    </div>
  )
}

export default FollowUser;