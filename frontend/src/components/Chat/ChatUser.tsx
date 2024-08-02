import React from 'react';

import userImage from '@assets/logo192.png'

const ChatUser = () => {
  return (
    <div 
      className={`
        flex gap-4 items-center px-[1.5rem] py-[1rem] 
        border-light-border
        dark:border-dark-border
        border-b
      `}
    >
      <div 
        className={`
          w-1/6
          border-light-border
          dark:border-dark-border
          rounded-full border
        `}
      >
        <img 
          src={userImage} 
          alt="NoImg" 
          className={`fit`}
        />
      </div>
      <div className={`w-4/5`}>
        <div className={`flex items-center mb-[0.25rem]`}>
          <div
            className={`
              text-light-text
              dark:text-dark-text
              font-medium  
            `}
          >
            사용자닉네임
          </div>
          <div 
            className={`
              ms-auto
              text-light-text-secondary
              dark:text-dark-text-secondary
              text-xs
            `}
          >
            오전 10:47
          </div>
        </div>
        <div className={`flex items-center`}>
          <div
            className={`
              text-light-text-secondary
              dark:text-dark-text-secondary
              text-[1rem]
            `}
          >
            마지막 대화 내용
          </div>
          <div 
            className={`
              ms-auto px-[0.5rem]
              bg-light-signature text-light-white 
              dark:bg-dark-signature dark:text-light-white
              text-sm rounded-lg
            `}
          >
            10
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatUser;