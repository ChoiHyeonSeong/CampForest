import React from 'react'
import { ReactComponent as HeartOutline } from '@assets/icons/heart-outline.svg'
import { ReactComponent as BookmarkEmpty } from '@assets/icons/bookmark-empty.svg'
import { ReactComponent as MoreDot} from '@assets/icons/more-dots.svg'
import { RootState } from '@store/store'
import { useSelector } from 'react-redux'
import { like } from '@services/boardService'

type Board = {
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
  board: Board;
}

const Board = (props: Props) => {
  const user = useSelector((state: RootState) => state.userStore);
  const handleLike = () => {
    console.log(props.board.boardId, user.userId)
    like(props.board.boardId, user.userId);
  }

  return (
    <div className='min-w-[22rem] my-[1.5rem] border-b border-[#EEEEEE] mx-[1.5rem] py-[0.5rem]'>
      <div className='flex items-center h-[3.5rem] mb-[2rem] md:mb-[1rem]'>
        <div className='rounded-full size-[4rem] md:size-[3rem] shadow-md overflow-hidden'></div>
        <div className='ms-[1rem]'>
          <div className='text-xl md:text-lg'>{props.board.userId}</div>
          <div className='md:text-sm'>캠핑 후기 {'>'} 경기</div>
        </div>
        <div className='ms-auto mb-auto relative'>
         <MoreDot className='size-8 absolute right-0 top-0'/>
         <div className='absolute z-10 right-4 top-8 bg-pink-300 px-1 w-28 rounded-sm'>
            <div className='w-full text-center border-b'>
              <button className='py-2 ps-2 pe-5'>수정하기</button>
            </div>
            <div className='w-full text-center'>
              <button className='py-2 ps-2 pe-5'>삭제하기</button>
            </div>
         </div>
        </div>
      </div>
      <div className='-mx-[1.5rem] md:mx-0'>
        <img 
          src={props.board.imageUrls[0]} 
          className={`${props.board.imageUrls.length == 0 ? 'hidden' : ''} 
          inline-block w-full static aspect-w-4 aspect-h-3`} 
        />
        <div className='mx-[1.5rem] md:mx-0 py-[1rem] px-[0.5rem]'>
          <div className='text-xl md:text-lg'>{props.board.content}</div>
          <div className='my-[0.5rem] md:text-xs'>_분 전</div>
        </div>
      </div>
      <div className='flex text-center mb-[1rem]'>
        <div>
          <HeartOutline onClick={handleLike} className='inline md:size-[1.25rem] cursor-pointer'/>
          <span className='mx-[0.5rem] md:text-sm'>{props.board.likeCount}</span>
        </div>
        <div>
          <HeartOutline className='inline md:size-[1.25rem]'/>
          <span className='mx-[0.5rem] md:text-sm'>3</span>
        </div>
        <div>
          <BookmarkEmpty className='inline md:size-[1.5rem]'/>
        </div>
      </div>
    </div>
  )
}

export default Board;