import React from 'react'

import userImage from '@assets/images/basic_profile.png'
import { SimilarUserType } from '@store/userSlice'
import { useNavigate } from 'react-router-dom';
import FollowBtn from '@components/User/FollowBtn';

type Props = {
  userInfo: SimilarUserType;
}

const RecommandUser:React.FC<Props> = (props) => {
  const navigate = useNavigate();

  const handelUserClick = () => {
    navigate(`/user/${props.userInfo.userId}`);  
  }

  return (
    <div className={`relative min-h-[13.5rem] md:h-[15rem] p-[1rem] bg-light-gray dark:bg-dark-gray text-center rounded`}>
      <img
        src={props.userInfo.userProfileUrl ? props.userInfo.userProfileUrl : userImage} 
        alt="NoImg" 
        className={`
          w-[80%] md:w-[90%] aspect-1 mx-auto mb-[0.5rem]
          border-light-border
          dark:border-dark-border
          rounded-full border cursor-pointer
        `}
        onClick={() => handelUserClick()}
      />
      <div
        className='text-sm md:text-base font-semibold mb-[0.5rem] cursor-pointer line-clamp-1'
        onClick={() => handelUserClick()}
      >
        {props.userInfo.userNickName}
      </div>
      <div 
        className='
          text-light-text-secondary
          dark:text-dark-text-secondary 
          text-xs
        '
      >
        함께 아는 친구 {props.userInfo.commonFollowsCount}명
      </div>
      <button 
        className={`
          md:absolute bottom-[1rem] left-0 w-[75%] mx-[12.5%] py-[0.25rem]
          text-xs rounded-md max-md:line-clamp-1
        `}
      >
        <FollowBtn targetUserId={props.userInfo.userId}/>
      </button>
    </div>
  )
}

export default RecommandUser;