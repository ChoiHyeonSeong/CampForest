import React from 'react';

import userImage from '@assets/logo192.png'

const Notification = () => {
  return (
    <div className='flex py-[0.5rem] items-center'>
      {/* 사용자 이미지 */}
      <div className='rounded-full border w-1/6'>
          <img src={userImage} alt="NoImg" className='fit'/>
      </div>
      {/* 팔로잉 알림 */}
      <div className='hidden grid-cols-4 w-5/6 items-center'> {/* 사용하고싶으면 hidden -> grid */}
        <div className='col-span-3 px-3 text-sm'>
          <span className='font-bold'>사용자 아이디</span>
          <span>님이 회원님을 팔로우하기 시작했습니다.</span>
          <span className='ms-3 text-xs text-[#999999]'>20분</span>
        </div>
        <div className='text-xs py-1 bg-[#FF7F50] text-center text-white rounded-md'>팔로우</div>
      </div>
      {/* 좋아요 / 댓글 알림 */}
      <div className='grid grid-cols-5 w-5/6 items-center'>
        <div className='col-span-4 px-3 text-sm'>
          <span className='font-bold'>사용자 아이디</span>
          <span>님 외 여러 명이 회원님의 게시글을 좋아합니다.</span>
          <span className='ms-3 text-xs text-[#999999]'>20분</span>
        </div>
        <img src={userImage} alt="NoImg" className='h-full border' />
      </div>
    </div>
  )
}

export default Notification;