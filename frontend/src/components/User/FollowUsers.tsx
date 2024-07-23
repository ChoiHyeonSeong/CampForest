import React from 'react'
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg' 
import FollowUser from './FollowUser'

type Props = {
  isFollowing: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FollowUsers = ({isFollowing, setIsModalOpen}: Props) => {

  return (
    <div className='overflow-auto md:mx-auto h-full md:w-[30rem] bg-white md:rounded-md p-8 relative'>
      <div className='text-xl font-bold mb-8'>{`${isFollowing ? '팔로잉' : '팔로워'}`} 목록</div>
      <div onClick={() => setIsModalOpen(false)} className='absolute right-8 top-8 cursor-pointer'>
        <CloseIcon className='md:block size-8' fill='000000' />
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