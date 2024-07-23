import React from 'react'

import userImage from '@assets/logo192.png'

const RecommandUser = () => {
  return (
    <div className='grid grid-cols-6 items-center'>
      <img src={userImage} alt="NoImg" className='size-10 rounded-full border'/>
      <div className='col-span-3 ms-[0.75rem]'>사용자 닉네임</div>
      <button className='col-span-2 bg-[#FF7F50] text-xs text-white rounded-md mx-[1rem] py-[0.25rem]'>팔로우</button>
    </div>
  )
}

export default RecommandUser;