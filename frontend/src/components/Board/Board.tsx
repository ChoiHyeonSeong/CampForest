import React, { useState, useEffect } from 'react'
import { ReactComponent as HeartOutline } from '@assets/icons/heart-outline.svg'
import { ReactComponent as FillHeartIcon } from '@assets/icons/heart-fill.svg'
import { ReactComponent as BookmarkEmpty } from '@assets/icons/bookmark-empty.svg'
// import { ReactComponent as BookmarkFill } from '@assets/icons/bookmark-fill.svg'
import { ReactComponent as CommentIcon} from '@assets/icons/comment.svg'
import { RootState } from '@store/store'
import { useSelector } from 'react-redux'
import MoreOptionsMenu from '@components/Public/MoreOptionsMenu'
import { useNavigate } from 'react-router-dom'

import { boardDelete, boardLike, boardDislike } from '@services/boardService';

export type BoardType = {
  boardId: number;
  userId: number;
  title: string;
  content: string;
  category: string;
  likeCount: number;
  createdAt: string;
  modifiedAt: string;
  imageUrls: string[];
  boardOpen: boolean;
}

type Props = {
  board: BoardType;
  deleteFunction: () => void;
}

const Board = (props: Props) => {
  const user = useSelector((state: RootState) => state.userStore);
  const navigate = useNavigate();

  const [timeDifference, setTimeDifference] = useState('');
  const isUserPost = user.userId === props.board.userId

  const deleteBoard = async (boardId: number) => {
    try {
      const result = await boardDelete(boardId)
      props.deleteFunction()
      console.log(result)
    } catch (error) {
      console.log(error)
    };
  };

  const goBoardDetail = () => {
    navigate(`/board/detail/${props.board.boardId}`)
  }
  
  const like = async () => {
    try {
      const result = await boardLike(props.board.boardId, user.userId)
      console.log(result)
    } catch (error) {
      console.log(error)
    };
  }

  const dislike = async () => {
    try {
      const result = await boardDislike(props.board.boardId, user.userId)
      console.log(result)
    } catch (error) {
      console.log(error)
    };
  }
  
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };

  const calculateTimeDifference = (modifiedAt: string) => {
    const modifiedDate = new Date(modifiedAt);
    const currentDate = new Date();
    const differenceInMilliseconds = currentDate.getTime() - modifiedDate.getTime();
  
    const differenceInMinutes = Math.floor(differenceInMilliseconds / 1000 / 60);
    const differenceInHours = Math.floor(differenceInMinutes / 60);
  
    if (differenceInMinutes >= 1440) {
      return formatDate(modifiedDate);
    }
  
    if (differenceInMinutes >= 60) {
      const minutes = differenceInMinutes % 60;
      return `${differenceInHours}시간 전`;
    }
  
    return `${differenceInMinutes}분 전`;
  };

  useEffect(() => {
    const modifiedAt = props.board.createdAt; // 예: "2024-07-30T11:19:40" 형식의 시간 문자열
    const difference = calculateTimeDifference(modifiedAt);
    setTimeDifference(difference); // 계산된 값을 상태에 설정
  }, [props.board.createdAt]); // modifiedAt이 변경될 때마다 실행

  return (
    <div className='w-full min-w-[22rem] border-b border-[#EEEEEE]'>

      {/* 포스팅 상단바 */}
      <div className='flex justify-between items-center h-[3.5rem] mb-4'>
        <div className='flex '>
          <div className='rounded-full size-11 md:size-12 shadow-md overflow-hidden'></div>
          <div className='ms-[1rem]'>
            <div className='text-xl md:text-lg'>{props.board.userId}</div>
            <div className='md:text-sm' onClick={() => calculateTimeDifference(props.board.createdAt)}>{props.board.category}</div>
          </div>
        </div>
        <MoreOptionsMenu 
          isUserPost={isUserPost} 
          deleteFunction={deleteBoard} 
          deleteId={props.board.boardId}
          copyURL={`board/detail/${props.board.boardId}`}
        />
      </div>

      {/* 사진 및 내용 */}
      <div className='mb-2' onClick={goBoardDetail}>
        {/* 사진 */}
        <div className={`relative w-full pb-[75%] ${props.board.imageUrls.length > 0 ? '' : 'bg-gray-300'}`}>
          {props.board.imageUrls.length > 0 && (
            <img 
              src={props.board.imageUrls[0]} 
              alt="NOIMG"
              className='absolute top-0 left-0 w-full h-full object-cover' 
            />
          )}
        </div>
        {/* 내용 및 포스팅 시간 */}
        <div className='py-[1rem] px-[0.5rem]'>
          {/* 제목 */}
          <div className='md:text-xl text-lg break-all mb-2'>{props.board.title}</div>
          {/* 내용 */}
          <div className='md:text-base text-xl break-all'>
            {props.board.content}
          </div>
          <div className='my-2 text-xs md:text-sm text-gray-500'>{timeDifference}</div>
        </div>
      </div>

      {/* 좋아요, 댓글, 북마크 아이콘 */}
      <div className='flex justify-between text-center mb-[1rem]'>
        <div className='w-1/3'>
          <HeartOutline className='inline size-7 cursor-pointer'/>
          {/* <FillHeartIcon className='inline size-7 cursor-pointer'/> */}
          <span className='mx-2 md:text-sm'>{props.board.likeCount}</span>
        </div>
        <div className='w-1/3'>
          <CommentIcon className='inline size-6 cursor-pointer'/>
          <span className='mx-2 md:text-sm'>3</span>
        </div>
        <div className='w-1/3'>
          <BookmarkEmpty className='inline size-7 cursor-pointer'/>
        </div>
      </div>
    </div>
  )
}

export default Board;