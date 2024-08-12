import React, { useEffect, useState } from 'react';
import Board from './Board'
import BoardComment, { CommentType } from './BoardComment'
import CommentInput from './CommentInput';
import { BoardType } from '@components/Board/Board';
import { commentList, commentWrite } from '@services/commentService';

type Props = {
  selectedBoard: BoardType;
  detailClose: () => void;
  pageReload: () => void;
  updateComment: (boardId: number, commentCount: number) => void;
  updateLike: (boardId: number, isLiked: boolean, likedCount: number) => void;
  updateSaved: (boardId: number, isSaved: boolean) => void;
}

const BoardDetail = (props: Props) => {
  // const boardId = props.selectedBoardId

  const [comments, setComments] = useState<CommentType[]>([]);

  // const fetchBoard = async () => {
  //   try {
  //     setIsLoading(true)
  //     const result = await boardDetail(boardId);
  //     setIsLoading(false)

  //     console.log(result)
  //     setBoard(result.data.data);
  //   } catch (error) {
  //     setIsLoading(false)
  //     console.error('게시글 불러오기 실패: ', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchComments = async () => {
    try {
      const result = await commentList(props.selectedBoard.boardId);
      console.log(result.content);
      setComments(result.content);
      if (props.selectedBoard) {
        props.updateComment(props.selectedBoard.boardId, result.totalElements)
      }
    } catch (error) {
      console.error('댓글 불러오기 실패: ', error);
    }
  };

  useEffect(() => {
    // fetchBoard();
    fetchComments();
  }, [props.selectedBoard.boardId]);

  const handleAddComment = async (comment: string) => {
    try {
      await commentWrite(props.selectedBoard.boardId, comment);
      fetchComments();

    } catch (error) {
      console.error('댓글 작성 실패: ', error);
    }
  };

  const deleteFunction = () => {
    props.pageReload()
    props.detailClose()
  }

  if (!props.selectedBoard) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <div 
      onClick={props.detailClose}
      className={`
        flex justify-center fixed inset-0 z-[20] lg:z-[100] max-md:h-[calc(100vh-6.4rem)] max-lg:mt-[3.2rem]
        bg-light-black bg-opacity-80 max-lg:bg-light-white max-lg:bg-opacity-100
        dark:bg-opacity-80
        overflow-y-auto
      `}
    >
      <div 
        onClick={(event) => event.stopPropagation()}
        className={`
          flex flex-col z-[110] w-full lg:w-[40rem] h-fit lg:mb-[3rem] lg:mt-[1rem]
          bg-light-white dark:bg-dark-white overflow-hidden rounded-md
        `}
      >
        <div 
          className={`
            w-full
          `}
        >
          <Board 
            board={props.selectedBoard}
            deleteFunction={deleteFunction} 
            isDetail={true}
            updateComment={props.updateComment}
            updateLike={props.updateLike}
            updateSaved={props.updateSaved}
          />
        </div>
        {/* 게시물 상세 */}
        <div 
          className={`
            relative w-full
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
                    updateComment={props.updateComment}
                    comment={comment}
                  />
                ))
              ) : (
                <div className='m-[3rem]'>아직 댓글이 없습니다.</div>
              )
            }
          </div>
          <div className={`z-[300] w-full h-[3rem]`}>
            <CommentInput
              onAddComment={handleAddComment} />
          </div>
        </div>
      </div> 
    </div>
  )
}

export default BoardDetail