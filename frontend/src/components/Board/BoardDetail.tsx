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
    <div className={`flex justify-center min-h-screen`}>
      <div className={`flex flex-col lg:flex-row w-full lg:w-[60rem] mb-[3rem] max-lg:p-[1.5rem] lg:pt-[1rem]`}>
        <div 
          className={`
            lg:w-3/5 min-h-[80vh]
            rounded-md
          `}
        >
          <Board 
            board={board} 
            deleteFunction={goMain} 
            isDetail={true}
          />
        </div>
        {/* 게시물 상세 */}
        <div 
          className={`
            relative w-full lg:w-2/5 lg:h-[80vh] max-lg:p-[0.5rem]
            bg-light-white;
            dark:bg-dark-white;
            shadow-lg overflow-hidden lg:rounded-md
          `}
        >
          <div 
            className={`
              hidden lg:flex lg:items-center lg:absolute lg:top-0 w-full h-[5rem]
              bg-light-signature
              dark:bg-dark-signature
            `}
          >
            <div 
              className={`
                ps-[1rem]
                font-medium text-lg
              `}
            >
              댓글
            </div>
          </div>

          <div 
            className={`
              lg:absolute lg:top-[5rem] w-full h-[calc(100%-8rem)] lg:px-[0.5rem]
              lg:overflow-y-scroll 
            `}
          >
            {comments.map((comment, index) => (
              <BoardComment 
                key={index} 
                comment={comment} 
              />
            ))}
          </div>
          <div className={`lg:absolute lg:bottom-0 w-full h-[3rem]`}>
            <CommentInput onAddComment={handleAddComment} />
          </div>
        </div>
      </div> 
    </div>
  )
}

export default BoardDetail