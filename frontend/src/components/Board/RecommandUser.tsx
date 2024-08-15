import React, { useEffect } from 'react'

import userImage from '@assets/images/basic_profile.png'
import { SimilarUserType } from '@store/userSlice'
import { useNavigate } from 'react-router-dom';

type Props = {
  userInfo: SimilarUserType;
}

const RecommandUser:React.FC<Props> = (props) => {
  const navigate = useNavigate();

  const handelUserClick = () => {
    navigate(`/user/${props.userInfo.userId}`);  
  }

  return (
    <div className={`relative h-[17.5rem] md:h-[15rem] p-[1rem] bg-light-gray text-center rounded`}>
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
        className='font-medium cursor-pointer'
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
          absolute bottom-[1rem] left-0 w-[75%] mx-[12.5%] py-[0.25rem]
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