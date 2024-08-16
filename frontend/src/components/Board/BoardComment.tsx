import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import defaultProfileImage from '@assets/images/basic_profile.png';
import { commentDelete, commentDislike, commentLike, commentList } from '@services/commentService';
import { formatTime } from '@utils/formatTime';
import { RootState } from '@store/store';

import { ReactComponent as HeartIcon } from '@assets/icons/heart.svg';

import Swal from 'sweetalert2';

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
};

type Props = {
  updateComment: (boardId: number, commentCount: number) => void;
  comment: CommentType;
};

const BoardComment = (props: Props) => {
  const navigate = useNavigate();
  const userstate = useSelector((state: RootState) => state.userStore);
  const [timeDifference, setTimeDifference] = useState('');
  const [liked, setLiked] = useState(props.comment.liked);
  const [likeCount, setLikeCount] = useState(props.comment.likeCount);
  const [visible, setVisible] = useState(true);

  const popLoginAlert = () => {
    Swal.fire({
      icon: 'error',
      title: '로그인 해주세요.',
      text: '로그인 후 사용가능합니다.',
      confirmButtonText: '확인',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/user/login');
      }
    });
  };

  const like = async () => {
    if (userstate.isLoggedIn) {
      try {
        const result = await commentLike(props.comment.commentId);
        setLiked(true);
        setLikeCount(result);
      } catch (error) {
        console.log(error);
      }
    } else {
      popLoginAlert();
    }
  };

  const dislike = async () => {
    if (userstate.isLoggedIn) {
      try {
        const result = await commentDislike(props.comment.commentId);
        setLiked(false);
        setLikeCount(result);
      } catch (error) {
        console.log(error);
      }
    } else {
      popLoginAlert();
    }
  };

  useEffect(() => {
    console.log(props.comment);
    setTimeDifference(formatTime(props.comment.createdAt));
  }, []);

  return (
    <div
      className={`
        ${visible ? 'flex' : 'hidden'}
        justify-between items-center w-full min-h-[5rem] px-[1.25rem] py-[0.75rem]
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
            src={props.comment.userImage ? props.comment.userImage : defaultProfileImage}
            alt="NOIMG"
            className="w-full"
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
            {props.comment.commentWriterId === userstate.userId && (
              <div
                data-testid="e2e-boardcomment-5"
                className="
                ms-[0.5rem]
                text-light-warning
                dark:text-dark-warning
                text-sm cursor-pointer
              "
                onClick={async () => {
                  commentDelete(props.comment.commentId);
                  setVisible(false);
                  const result = await commentList(props.comment.boardId);
                  props.updateComment(props.comment.boardId, result.totalElements - 1);
                }}
              >
                삭제
              </div>
            )}
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
            data-testid="e2e-boardcomment-4"
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
            data-testid="e2e-boardcomment-4"
            onClick={like}
            className="
              size-[1.2rem]
              fill-none stroke-light-black
              dark:stroke-dark-black
              cursor-pointer
            "
          />
        )}
        <div className={`text-sm`}>{likeCount}</div>
      </div>
    </div>
  );
};

export default BoardComment;
