import React, { useEffect, useState } from 'react'
import { ReactComponent as HeartIcon } from '@assets/icons/heart.svg'
import { Link } from 'react-router-dom';
import { commentDislike, commentLike } from '@services/commentService';
import defaultProfileImage from '@assets/logo192.png'

export type CommentType = {
  commentId: number;
  commentWriterId: number;
  boardId: number;
  content: string;
  nickname: string;
  likeCount: number;
  userImage: string;
  createdAt: string;
  liked: boolean;
}

type Props = {
  comment: CommentType;
};

const BoardComment = (props: Props) => {
  const [timeDifference, setTimeDifference] = useState('');
  const [liked, setLiked] = useState(props.comment.liked);
  const [likeCount, setLikeCount] = useState(props.comment.likeCount);

  const calculateTimeDifference = (createdAt: string) => {
    const modifiedDate = new Date(createdAt);
    const currentDate = new Date();
    const differenceInMilliseconds = currentDate.getTime() - modifiedDate.getTime();
  
    const differenceInMinutes = Math.floor(differenceInMilliseconds / 1000 / 60);
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    const differenceInDays = Math.floor(differenceInHours / 24);
  
    if (differenceInMinutes >= 1440) {
      return `${differenceInDays}일 전`;
    }
  
    if (differenceInMinutes >= 60) {
      return `${differenceInHours}시간 전`;
    }
  
    return `${differenceInMinutes}분 전`;
  };

  const like = async () => {
    try {
      const result = await commentLike(props.comment.commentId);
      setLiked(true);
      setLikeCount(result);
    } catch (error) {
      console.log(error);
    }
  }

  const dislike = async () => {
    try {
      const result = await commentDislike(props.comment.commentId);
      setLiked(false);
      setLikeCount(result);
    } catch (error) {
      console.log(error);
    };
  }

  useEffect(() => {
    console.log(props.comment)
    setTimeDifference(calculateTimeDifference(props.comment.createdAt));
  }, [])

  return (
    <div 
      className={`
        flex justify-between items-center w-full min-h-[5rem] px-[0.5rem] py-[0.75rem]
        bg-light-white border-light-border-1
        dark:bg-dark-white dark:border-dark-border-1
          border-b
        `}
    >
      <div className={`flex items-center`}>
        {/* 프로필 이미지 */}
        <Link
          to={`/user/${props.comment.commentWriterId}`}
          className={`
            flex items-center justify-center rshrink-0 size-[2.5rem] me-[1rem]
          border-light-border
            dark:border-dark-border  
            shadow-sm border rounded-full overflow-hidden
          `}
        >
          {/* 사용자 프로필 이미지 받아와서 넣을 곳 ! */}
          <img 
            src={props.comment.userImage ? props.comment.userImage : defaultProfileImage } 
            alt='NOIMG'
            className='w-full'
          />
        </Link>

        {/* 닉네임 및 글 */}
        <div>
          <div className={`flex items-center mb-[0.25rem]`}>
            <Link
              to={`/user/${props.comment.commentWriterId}`}
              className={`
                me-[0.5rem]
                text-sm font-medium
              `}
            >
              {props.comment.nickname}
            </Link>
            <div 
              className={`
                text-light-text-secondary
                dark:text-dark-text-secondary
                text-xs
              `}
            >
              {timeDifference}
            </div>
          </div>
          {/* user-comment */}
          <div 
            className={`
            text-light-text
              dark:text-dark-text
              break-all
            `}
          >
            {props.comment.content}
          </div>
        </div>
      </div>
      {/* 좋아요 */}
      <div 
        className={`
          ms-[1rem] space-y-[0.5rem]
          text-center
        `}
      >
        {liked ? (
          <HeartIcon
            onClick={dislike}
            className={`
              size-[1.2rem] 
              fill-light-heart stroke-light-heart
              dark:fill-dark-heart dark:stroke-dark-heart
              cursor-pointer
            `} 
          />
        ) : (
          <HeartIcon
            onClick={like}
            className='
              size-[1.2rem]
              fill-none stroke-light-black
              dark:stroke-dark-black
              cursor-pointer
            '
          />
        )}
        <div className={`text-sm`}>{likeCount}</div>
      </div>
    </div>
  )
}

export default BoardComment