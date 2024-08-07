import React, { useState, useEffect, useRef } from 'react'

import { followingList, userUnfollow, userFollow } from '@services/userService';

type UserInfo = {
  userId: number;
}

type Props = {
  targetUserId: number;
  callbackFunction?: () => void
}

const FollowBtn = (props: Props) => {
  const loginUserId = Number(sessionStorage.getItem('userId'));
  const [isFollowingState, setIsFollowingState] = useState(false);
  const isFollowingRef = useRef(false);

  const fetchFollowing = async (first = false) => {
    try {
      const followingData: UserInfo[] = await followingList(loginUserId);
      const checkUserId = () => {
        return followingData.find(item => item['userId'] === props.targetUserId) ? true : false;
      };

      isFollowingRef.current = checkUserId()

      if (first) {
        setIsFollowingState(isFollowingRef.current)
      } else {
        if (isFollowingRef.current) {
          const response = await userUnfollow(props.targetUserId)
          console.log(response)
        } else {
          const response = await userFollow(props.targetUserId)
          console.log(response)
        }

        if (props.callbackFunction) {
          props.callbackFunction()
        }
        setIsFollowingState(!isFollowingRef.current)
      }
    } catch (error) {
      console.error("Failed to fetch Followings: ", error);
    }
  }

  useEffect(() => {
    fetchFollowing(true)
  }, [])
  
  return (
    <div 
      onClick={() => fetchFollowing()}
      className={`
        ${
          isFollowingState ? 
          'bg-light-signature text-light-white dark:bg-dark-signature dark:text-dark-white' : 
          'bg-light-gray-1 dark:bg-dark-gray-1'
        }
        me-[0.5rem] px-[0.75rem] md:px-[1rem] py-[0.25rem]
        cursor-pointer rounded-md text-[100%]
      `}
    >
      {isFollowingState ? ('팔로잉') : ('팔로우')}
    </div>
  )
}

export default FollowBtn