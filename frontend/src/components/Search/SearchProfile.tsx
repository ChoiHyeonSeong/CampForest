import React from 'react'
import { useNavigate } from 'react-router-dom';

import defaultImage from '@assets/images/basic_profile.png';

import FollowBtn from '@components/User/FollowBtn';

export type profileType = {
  userId: number;
  nickname: string;
  followerCount : number;
  followingCount : number;
  profileImage: string;
}

type Props = {
  profile: profileType
  callbackFunction: (userId: number) => void;
}

const SearchProfile = (props: Props) => {
  const navigate = useNavigate();

  const callbackFunc = () => {
    props.callbackFunction(props.profile.userId)
  }

  return (
    <div
      className='
        flex justify-between items-center w-full mb-[0.5rem] px-[0.5rem] md:px-[1rem] py-[1.5rem]
        border-light-border-1 bg-light-white bg-opacity-80
        dark:border-dark-border-1 dark:bg-dark-white dark:bg-opacity-80
        border-b rounded
      '
    >
      <div 
        onClick={() => navigate(`/user/${props.profile.userId}`)}
        className='flex items-center cursor-pointer'
      >
        {/* 프로필 이미지 */}
        <div className='size-[2.9rem] md:size-[3.1rem] me-[0.5rem] rounded-full overflow-hidden border border-light-border-1'>
          <img src={props.profile.profileImage ? props.profile.profileImage : defaultImage} alt='프로필 이미지' className='size-full'></img>
        </div>

        {/* 프로필 상세 */}
        <div>
          <div className='md:text-[1.05rem] font-medium mb-[0.25rem]'>{props.profile.nickname}</div>
          <div className='flex'>
            <div
              className='
                me-[0.5rem]
                text-light-text-secondary 
                dark:text-dark-text-secondary
                text-xs md:text-[0.85rem]
                '
              >
                팔로워
                <span className='font-medium'>{props.profile.followerCount}</span>
            </div>
            <div
              className='
                me-[0.5rem]
                text-light-text-secondary 
                dark:text-dark-text-secondary
                text-xs md:text-[0.85rem]
                '
              >
                팔로잉
                <span className='font-medium'>{props.profile.followingCount}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 버튼 */}
      <div className='flex flex-all-center'>
        <FollowBtn targetUserId={props.profile.userId} callbackFunction={callbackFunc}/>
        <button
          className='
            px-[0.5rem] py-[0.2rem] md:px-[0.8rem]  md:py-[0.4rem]
            bg-light-gray-1 hover:bg-light-gray-2 text-light-text
            dark:bg-dark-gray-1 dark:hover:bg-dark-gray-2 dark:text-dark-text
            rounded-md text-sm md:text-base
            '
          >
            채팅
        </button>
      </div>
    </div>
  )
}

export default SearchProfile