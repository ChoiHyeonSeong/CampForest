import React from 'react'

import userImage from '@assets/images/basic_profile.png'

const RecommandUser = () => {
  return (
    <div className={`grid grid-cols-6 items-center`}>
      <img 
        src={userImage} 
        alt="NoImg" 
        className={`
          size-[2.5rem]
          border-light-border
          dark:border-dark-border
          rounded-full border
          `}
        />
      <div className={`col-span-3 ms-[0.75rem]`}>
        사용자 닉네임
      </div>
      <button 
        className={`
          col-span-2 mx-[1rem] py-[0.25rem]
          bg-light-signature text-light-white
          dark:bg-dark-signature dark:text-dark-white
          text-xs rounded-md
        `}
      >
        팔로우
      </button>
    </div>
  )
}

export default RecommandUser;