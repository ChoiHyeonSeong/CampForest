import React from 'react'

export type BoardType = {
  boardId: number;
  boardOpen: boolean;
  category: string;
  title: string;
  commentCount: number;
  content: string;
  nickname: string;
  createdAt: string;
  likeCount: number;
  imageUrls: string[];
}

type Props = {
  board: BoardType
}

const SerarchBoard = (props: Props) => {

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div
      className='
        flex justify-between items-center w-full px-[0.5rem] md:px-[1rem] py-[1.5rem] mb-[0.5rem]
        border-light-border-1 bg-light-white bg-opacity-80
        dark:border-dark-border-1 dark:bg-dark-white dark:bg-opacity-80
        border-b rounded
        '
      >
      {/* 게시물 내용 */}
      <div>
        {/* 게시물 제목 */}
        <p
          className='
            text-light-text
            dark:text-dark-text
            font-bold md:text-lg break-all line-clamp-1
            '
          >
            {props.board.title}
          </p>

        {/* 게시물 내용 */}
        <div
          className='
            w-full my-[0.5rem]
            text-light-text-secondary
            dark:text-dark-text-secondary
            font-medium line-clamp-2 break-all text-sm md:text-base
          '
        >
          {props.board.content}
        </div>

        {/* 게시글 작성일 */}
        <div
          className='
          mb-[0.25rem]
            text-light-text-secondary
            dark:text-dark-text-secondary
            text-sm
          '
        >
          {formatDate(props.board.createdAt)}
        </div>

        {/* 게시물 정보 */}
        <div className='flex items-center'>
          <div className='font-medium text-sm'>{props.board.nickname}</div>
          <div
            className='
              mx-[0.5rem]
              text-light-text-secondary
              dark:text-dark-text-secondary
              text-sm
            '
          >
            좋아요
            <span className='ms-[0.15rem]'>{props.board.likeCount}</span>
          </div>
          <div
            className='
              text-light-text-secondary
              dark:text-dark-text-secondary
              text-sm
            '
          >
            댓글
            <span className='ms-[0.15rem]'>{props.board.commentCount}</span>
          </div>
        </div>
      </div>

      {/* 게시물 사진 -> 없으면 사이즈 0*/} 
      <div
        className='
          shrink-0 size-[4rem] sm:size-[4.5rem] md:size-[5.5rem] lg:size-[6.5rem] ms-[1.5rem]
          bg-gray-200
          overflow-hidden rounded-sm
          '
        >
        {props.board.imageUrls.length > 0 && (
          <img src={props.board.imageUrls[0]} alt='게시물 사진' className='w-full h-full object-cover' />
        )}
      </div>
    </div>
  )
}

export default SerarchBoard