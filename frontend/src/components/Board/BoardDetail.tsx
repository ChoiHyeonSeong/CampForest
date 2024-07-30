import React from 'react'
import Board from './Board'
import BoardComment from './BoardComment'


const BoardDetail = () => {

  const boardData = {
    boardId: 1,
    userId: 1,
    title: "Sample Title",
    content: "This is a sample content",
    category: "Camping",
    likeCount: 10,
    createdAt: "2024-07-29T00:00:00Z",
    modifiedAt: "2024-07-29T00:00:00Z",
    imageUrls: ["https://via.placeholder.com/150"],
    boardOpen: true
  };

  return (
    <div className='flex justify-center'>
      <div className='p-6 w-full lg:w-[50rem] lg:p-0 mb-20'>
        <Board board={boardData} />

        {/* 게시물 상세 */}
        <div className='w-full h-60 min-w-[22rem] p-2'>
          <BoardComment />
          <BoardComment />
          <BoardComment />
          <BoardComment />

        </div>
      </div>
      
    </div>
  )
}

export default BoardDetail