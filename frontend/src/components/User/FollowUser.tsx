import React from 'react';

type Props = {
  userId: number;
  nickname: string;
  profileImage: string;
}

const FollowUser = (props: Props) => {
  return (
    <div
      className={`
        flex md:mx-[0.75rem] py-[0.75rem]
        border-light-border-1
        dark:border-dark-border-1
        border-b
      `}
    >
      <img 
        src={props.profileImage} 
        alt="프로필 사진" 
        className={`
          size-[3.25rem] me-1
          border-light-border-1
          dark:border-dark-border-1
          rounded-full border
        `}
      />
      <div 
        className={`
          flex flex-col justify-center ms-[0.5rem]`
        }>
        <div
          className={`
            font-bold
            text-light-text
            dark:text-dark-text
          `}
        >
          {props.nickname}
        </div>
        <div
          className={`
            text-light-text-secondary
            dark:text-dark-text-secondary
          `}
        >
          닉네임
        </div>
      </div>
      <div className={`flex items-center ms-auto`}>
        
        {/* 팔로잉 버튼 클릭 시 버튼 색상 전환되야함
          bg-light-anchor text-light-text-white  // 클릭시 토글전환색상
          dark:bg-dark-anchor dark:text-dark-text-white   // 클릭시 토글전환색상
        */}
        <button 
          className={`
            py-[0.25rem] px-[0.75rem]
            bg-light-border-1 text-light-text
            rounded-md
          `}
        >
          팔로잉
        </button>
      </div>
    </div>
  )
}

export default FollowUser;