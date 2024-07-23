import React from 'react';

import userImage from '@assets/logo192.png'

const ChatUser = () => {
  return (
    <div className='flex px-[1.5rem] py-[1rem] items-center gap-4 border-b'>
      <div className='rounded-full border w-1/5'>
        <img src={userImage} alt="NoImg" className='fit'/>
      </div>
      <div className='w-4/5'>
        <div className='flex mb-1 items-center'>
          <div>사용자닉네임</div>
          <div className='ms-auto text-xs text-[#999999]'>오전 10:47</div>
        </div>
        <div className='flex items-center'>
          <div className='text-sm text-[#999999]'>마지막 대화 내용</div>
          <div className='bg-red-500 rounded-lg text-white text-sm px-2 ms-auto'>10</div>
        </div>
      </div>
    </div>
  )
}

export default ChatUser;