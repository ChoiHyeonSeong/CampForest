import React from 'react'
import { ReactComponent as HeartOutline } from '@assets/icons/heart-outline.svg'
// import { ReactComponent as FillHeartIcon } from '@assets/icons/heart-fill.svg'
import { ReactComponent as BookmarkEmpty } from '@assets/icons/bookmark-empty.svg'
// import { ReactComponent as BookmarkFill } from '@assets/icons/bookmark-fill.svg'
import { ReactComponent as CommentIcon} from '@assets/icons/comment.svg'
import { RootState } from '@store/store'
import { useSelector } from 'react-redux'
import { like } from '@services/boardService'
import MoreOptionsMenu from '@components/MoreOptionsMenu'


type BoardType = {
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
}

const Board = (props: Props) => {
  const user = useSelector((state: RootState) => state.userStore);

  const isUserPost = user.userId === props.board.userId

  const handleLike = () => {
    console.log(props.board.boardId, user.userId)
    like(props.board.boardId, user.userId);
  }

  return (
    <div className='min-w-[22rem] border-b border-[#EEEEEE]'>

      {/* 포스팅 상단바 */}
      <div className='flex justify-between items-center h-[3.5rem] mb-4'>
        <div className='flex '>
          <div className='rounded-full size-11 md:size-12 shadow-md overflow-hidden'></div>
          <div className='ms-[1rem]'>
            <div className='text-xl md:text-lg'>{props.board.userId}</div>
            <div className='md:text-sm'>캠핑 후기 {'>'} 경기</div>
          </div>
        </div>
        <MoreOptionsMenu isUserPost={isUserPost}/>
      </div>

      {/* 사진 및 내용 */}
      <div className='mb-2'>
        {/* 사진 */}
        <div className='relative w-full pb-[75%]'>
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
          <div className='md:text-xl text-lg break-all mb-2'>게시글 제목이요</div>
          {/* 내용 */}
          <div className='md:text-base text-xl break-all'>
            {props.board.content}
          </div>
          <div className='my-2 text-xs md:text-sm text-gray-500'>50분 전</div>
        </div>
      </div>

      {/* 좋아요, 댓글, 북마크 아이콘 */}
      <div className='flex justify-between text-center mb-[1rem]'>
        <div className='w-1/3'>
          <HeartOutline onClick={handleLike} className='inline size-7 cursor-pointer'/>
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