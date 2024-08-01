import React from 'react'
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg' 
import FollowUser from './FollowUser'

type Props = {
  isFollowing: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FollowUsers = ({isFollowing, setIsModalOpen}: Props) => {

  return (
    <div
      className={`
        relative md:w-[30rem] h-full md:mx-auto p-[2rem]
        bg-light-white
        dark:bg-dark-white
        overflow-auto md:rounded-md
      `}
    >
      <div
        className={`
          mb-[2rem]
          text-light-text
          dark:text-dark-text
          text-[1.25rem] font-bold
        `}
      >
        {`${isFollowing ? '팔로잉' : '팔로워'}`} 목록
      </div>
      <div
        onClick={() => setIsModalOpen(false)}
        className={`
          absolute right-[2rem] top-[2rem]
          cursor-pointer
        `}
      >
        <CloseIcon
          className={`
            size-[1.75rem] md:block
            fill-light-border-icon
            dark:fill-dark-border-icon
          `}
        />
      </div>
      <div className='flex flex-col'>
        <FollowUser />
        <FollowUser />
        <FollowUser />
        <FollowUser />
        <FollowUser />
      </div>
    </div>
  )
}

export default FollowUsers;