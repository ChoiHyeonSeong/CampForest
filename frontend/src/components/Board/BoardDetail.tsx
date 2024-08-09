import React, { useEffect, useState } from 'react';
import Board from './Board'
import BoardComment, { CommentType } from './BoardComment'
import CommentInput from './CommentInput';
import { BoardType } from '@components/Board/Board';
import { boardDetail } from '@services/boardService';
import { useNavigate } from 'react-router-dom';
import { commentList, commentWrite } from '@services/commentService';

type Props = {
  selectedBoardId: number;
  detailClose: () => void;
}

const BoardDetail = (props: Props) => {
  const navigate = useNavigate();
  const boardId = props.selectedBoardId

  const [comments, setComments] = useState<CommentType[]>([]);
  const [board, setBoard] = useState<BoardType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBoard = async () => {
    try {
      setIsLoading(true)
      const result = await boardDetail(boardId);
      setIsLoading(false)

      console.log(result)
      setBoard(result.data.data);
    } catch (error) {
      setIsLoading(false)
      console.error('게시글 불러오기 실패: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const result = await commentList(boardId);
      console.log(result.content);
      setComments(result.content);
      if(board) {
        setBoard({...board, commentCount: result.totalElements});
      }
    } catch (error) {
      console.error('댓글 불러오기 실패: ', error);
    }
  };

  useEffect(() => {
    fetchBoard();
    fetchComments();
  }, [boardId]);

  const handleAddComment = async (comment: string) => {
    try {
      await commentWrite(boardId, comment);
      fetchComments();

    } catch (error) {
      console.error('댓글 작성 실패: ', error);
    }
  };

  const goMain = () => {
    navigate('/')
  };

  if (isLoading) {
    return <div></div>; // 또는 로딩 스피너 컴포넌트
  }

  if (!board) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <div 
      onClick={props.detailClose}
      className={`
        flex justify-center fixed inset-0 z-[20] lg:z-[100] max-md:h-[calc(100vh-6.4rem)] max-lg:mt-[3.2rem]
        bg-light-black bg-opacity-80 max-lg:bg-light-white max-lg:bg-opacity-100
        overflow-y-auto
      `}
    >
      <div 
        onClick={(event) => event.stopPropagation()}
        className={`
          flex flex-col z-[110] w-full lg:w-[40rem] h-fit lg:mb-[3rem] lg:pt-[1rem]
        `}
      >
        <div 
          className={`
            w-full 
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
            relative w-full
            bg-light-white
            dark:bg-dark-white
            shadow-lg overflow-hidden
          `}
        >

          <div 
            className={`
              w-full
            `}
          >
            {
              comments.length >= 1 ? (
                comments.map((comment) => (
                  <BoardComment 
                    key={comment.commentId} 
                    comment={comment}
                  />
                ))
              ) : (
                <div className='m-[3rem]'>아직 댓글이 없습니다.</div>
              )
            }
          </div>
          <div className={`w-full h-[3rem]`}>
            <CommentInput
              onAddComment={handleAddComment} />
          </div>
        </div>
      </div> 
    </div>
  )
}

export default BoardDetail