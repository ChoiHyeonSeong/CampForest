import React from 'react'
import { ReactComponent as HeartOutlineIcon } from '@assets/icons/Heart-outline-fill.svg'
import { ReactComponent as FillHeartIcon } from '@assets/icons/heart-fill.svg'

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
  return (
    <div 
      className={`
        flex justify-between items-center w-full min-h-[5rem] px-[0.5rem] py-[0.75rem]
        bg-light-white border-light-border-1
        dark:bg-dark-white dark:border-dark-border-1
          border-b
        `}
    >
      <div className={`flex`}>
        {/* 프로필 이미지 */}
        <div 
          className={`
            shrink-0 size-[2.5rem] me-[0.5rem]
          border-light-border
            dark:border-dark-border  
            shadow-sm border rounded-full
          `}
        >
          {/* 사용자 프로필 이미지 받아와서 넣을 곳 ! */}
          <img 
            src={props.comment.userImage} 
            alt='NOIMG'
          />
        </div>

        {/* 닉네임 및 글 */}
        <div>
          <div className={`flex mb-[0.25rem]`}>
            <div 
              className={`
                me-[0.5rem]
                text-sm font-medium
              `}
            >
              {props.comment.nickname}
            </div>
            <div 
              className={`
                text-light-text-secondary
                dark:text-dark-text-secondary
                text-xs
              `}
            >
              26분전
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
        <HeartOutlineIcon 
          className={`
            size-[1.2rem] 
            cursor-pointer
          `} 
        />
        <div className={`text-sm`}>{props.comment.likeCount}</div>
      </div>
    </div>
  )
}

export default BoardComment