import React, { useEffect, useState } from 'react'
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg' 
import FollowUser from './FollowUser'
import { followerList, followingList } from '@services/userService';

type Props = {
  userId: number;
  isFollowing: boolean;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type FollowUserType = {
  userId: number;
  nickname: string;
  profileImage: string;
}

const FollowUsers = ({userId, isFollowing, isModalOpen, setIsModalOpen}: Props) => {
  const [followUsers, setFollowUsers] = useState<FollowUserType[]>([]);

  const fetchFollowers = async () => {
    try {
      const followerData = await followerList(userId);
      setFollowUsers(followerData);
    } catch (error) {
      console.error("Failed to fetch Followers: ", error);
    }
  }

  const fetchFollowings = async () => {
    try {
      const followingData = await followingList(userId);
      setFollowUsers(followingData);
    } catch (error) {
      console.error("Failed to fetch Followings: ", error);
    }
  }

  useEffect(() => {
    if(isModalOpen) {
      if(isFollowing) {
        fetchFollowings();
      } else {
        fetchFollowers();
      }
    } else {
      setFollowUsers([]);
    }
  }, [isModalOpen])

  return (
    <div
      className={`
        relative h-full p-[2rem]
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
        {followUsers.map((followUser, index) => (
          <FollowUser 
            key={followUser.userId}
            userId={followUser.userId}
            nickname={followUser.nickname}
            profileImage={followUser.profileImage}
          />
        ))}
      </div>
    </div>
  )
}

export default FollowUsers;