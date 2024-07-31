import React, { useEffect, useState } from 'react';
import Board from './Board'
import BoardComment from './BoardComment'
import CommentInput from './CommentInput';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { BoardType } from '@components/Board/Board';
import { boardDetail } from '@services/boardService';
import { setIsLoading } from '@store/modalSlice';
import { useNavigate } from 'react-router-dom';

const BoardDetail = () => {
  const navigate = useNavigate();

  const params = useParams();

  const boardId = Number(params.boardId)

  const [comments, setComments] = useState<string[]>([]);

  const dispatch = useDispatch();

  const [board, setBoard] = useState<BoardType>(
    {
      boardId: 0,
      userId: 0,
      title: "",
      content: "",
      category: "",
      likeCount: 0,
      createdAt: "",
      modifiedAt: "",
      imageUrls: [],
      boardOpen: true
    }
  );

  const fetchBoards = async () => {
    try {
      dispatch(setIsLoading(true))
      const result = await boardDetail(boardId);
      dispatch(setIsLoading(false))

      console.log(result)
      setBoard(result.data.data);
    } catch (error) {
      dispatch(setIsLoading(false))
      console.error('게시글 불러오기 실패: ', error);
    }
  };

  useEffect(() => {
    fetchBoards()
  }, [boardId]);

  const handleAddComment = (comment: string) => {
    setComments([...comments, comment]);
  };

  const goMain = () => {
    navigate('/')
  };

  return (
    <div className='flex justify-center min-h-screen'>
      <div className='p-6 mb-12 w-full lg:w-[60rem] lg:p-0 lg:pt-4 flex flex-col lg:flex-row'>
        <div className='lg:w-3/5 rounded-md min-h-[80vh]'>
          <Board board={board} deleteFunction={goMain} isDetail={true}/>
        </div>
        
        {/* 게시물 상세 */}
        <div className='relative bg-white w-full lg:h-[80vh] lg:w-2/5 p-2 lg:p-0 lg:ms-0 lg:rounded-md0 shadow-lg overflow-hidden'>
          <div className='w-full h-20 bg-slate-200 lg:flex items-center lg:absolute lg:top-0 hidden '>
            <h6 className='font-medium text-lg ps-4'>댓글</h6>
          </div>

          <div className='lg:px-2 w-full h-[calc(100%-8rem)] lg:overflow-y-scroll lg:absolute lg:top-20'>
            {comments.map((comment, index) => (
              <BoardComment key={index} comment={comment} />
            ))}
          </div>

          <div className='w-full lg:absolute lg:bottom-0 h-12'>
            <CommentInput onAddComment={handleAddComment} />
          </div>
          
        </div>
      </div> 
    </div>
  )
}

export default BoardDetail