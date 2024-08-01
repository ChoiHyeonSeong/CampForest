import React from 'react';

import userImage from '@assets/logo192.png'

const Notification = () => {
  return (
    <div className={`flex items-center py-[0.5rem]`}>
      {/* 사용자 이미지 */}
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
      {/* 팔로잉 알림 */}
      <div className={`hidden grid-cols-4 w-5/6 items-center`}> {/* 사용하고싶으면 hidden -> grid */}
        <div 
          className={`
            col-span-3 px-[0.75rem]
            text-sm
          `}
        >
          <span className={`font-bold`}>
            사용자 아이디
          </span>
          <span>
            님이 회원님을 팔로우하기 시작했습니다.
          </span>
          <span 
            className={`
              ms-[0.75rem]
              text-light-text-secondary
              dark:text-dark-text-secondary 
              text-xs
            `}
          >
            20분
          </span>
        </div>
        <div 
          className={`
            py-[0.25rem]
            bg-light-signature text-light-white
            dark:bg-dark-signature dark:text-dark-white
            text-xs text-center rounded-md
          `}
        >
          팔로우
        </div>
      </div>
      {/* 좋아요 / 댓글 알림 */}
      <div className={`grid grid-cols-5 w-5/6 items-center`}>
        <div 
          className={`
            col-span-4 px-[0.75rem] 
            text-sm
          `}
        >
          <span className={`font-bold`}>
            사용자 아이디
          </span>
          <span>
            님 외 여러 명이 회원님의 게시글을 좋아합니다.
          </span>
          <span 
            className={`
              ms-[0.75rem] 
              text-light-text-secondary
              dark:text-dark-text-secondary
              text-xs 
            `}
          >
            20분
          </span>
        </div>
        <img 
          src={userImage} 
          alt="NoImg" 
          className={`
            h-full 
            border-light-border
            dark:border-dark-border
            border
          `}
        />
      </div>
    </div>
  )
}

export default Notification;