import React, { useEffect, useState } from 'react';
import Board from './Board'
import BoardComment, { CommentType } from './BoardComment'
import CommentInput from './CommentInput';
import { BoardType } from '@components/Board/Board';
import { commentList, commentWrite } from '@services/commentService';
import { ReactComponent as LeftIcon } from '@assets/icons/arrow-left.svg'
import { useLocation } from 'react-router-dom';

const useSwipe = ({ onSwipeLeft, onSwipeRight, minSwipeDistance = 50 }: {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  minSwipeDistance?: number;
}) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
      if (!touchStart || !touchEnd) return;
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;
      if (isLeftSwipe && onSwipeLeft) onSwipeLeft();
      if (isRightSwipe && onSwipeRight) onSwipeRight();
    };

    document.addEventListener('touchstart', onTouchStart);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);

    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, touchStart, touchEnd, minSwipeDistance]);

  return {};
};

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
  const [show, setShow] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setScreenSize('mobile');
      } else {
        setScreenSize('desktop');
      }
    };

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  useEffect(() => {
    if (location.pathname === '/') {
      handleDetailClose();
    }
  }, [location]);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(timer);
  }, []);

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
    fetchComments();
  }, [props.selectedBoard.boardId]);

  // useEffect(() => {
  //   setShow(true);
  // }, [])

  const handleAddComment = async (comment: string) => {
    try {
      await commentWrite(props.selectedBoard.boardId, comment);
      fetchComments();

    } catch (error) {
      console.error('댓글 작성 실패: ', error);
    }
  };
  
  const handleDetailClose = (e?: React.MouseEvent) => {
    if (screenSize === 'mobile' || (e && e.target === e.currentTarget)) {
      setShow(false);
      setTimeout(() => {
        props.detailClose();
      }, 300);
    }
  };
  
  const deleteFunction = () => {
    props.pageReload();
    setShow(false);
    setTimeout(() => {
      props.detailClose();
    }, 300);
  };

  useSwipe({
    onSwipeRight: () => {
      if (screenSize === 'mobile') {
        handleDetailClose();
      }
    },
    minSwipeDistance: 50,
  });

  if (!props.selectedBoard) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <div 
      onClick={handleDetailClose}
      className={`
        fixed inset-0 z-[60] 
        ${show ? 'bg-black bg-opacity-60' : 'bg-transparent'}
        transition-all duration-300 ease-in-out
        ${screenSize === 'mobile' ? 'overflow-hidden' : 'overflow-auto'}
        ${screenSize === 'mobile' ? 'max-md:h-[calc(100vh-3.2rem)]' : ''}
      `}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className={`
          ${show ? (screenSize === 'mobile' ? 'translate-x-0' : 'opacity-100') : (screenSize === 'mobile' ? 'translate-x-full' : 'opacity-0')}
          ${screenSize === 'mobile' ? 'fixed inset-y-0 left-0 right-0 w-full h-[calc(100vh-3.2rem)] mb-[3.2rem]' : 
            'mx-auto my-8 max-w-[40rem] max-h-[calc(100vh-4rem)]'}
            z-[110] bg-light-white dark:bg-dark-white
            flex flex-col
            transition-all duration-300 ease-in-out
            ${screenSize !== 'mobile' ? 'rounded-md' : ''}
          `}
      >

        {/* 뒤로가기 (모바일에서만 표시) */}
        {screenSize === 'mobile' && (
          <div className='flex items-center h-[3.2rem] px-[0.5rem] py-[0.25rem] sticky top-0 bg-light-white dark:bg-dark-white z-[120]'>
            <button onClick={() => handleDetailClose()} className='flex items-center'>
              <LeftIcon className='size-[1.1rem] fill-light-text dark:fill-dark-text' />
              <p className='font-medium ml-2'>뒤로</p>
            </button>
          </div>
        )}

        {/* 스크롤 가능한 컨텐츠 영역 */}
        <div className='flex-1 overflow-y-auto'>
          <div className='w-full'>
            <Board 
              board={props.selectedBoard}
              deleteFunction={deleteFunction} 
              isDetail={true}
              updateComment={props.updateComment}
              updateLike={props.updateLike}
              updateSaved={props.updateSaved}
            />
          </div>
          
          <div className='w-full'>
            {comments.length >= 1 ? (
              comments.map((comment) => (
                <BoardComment 
                  key={comment.commentId}
                  updateComment={props.updateComment}
                  comment={comment}
                />
              ))
            ) : (
              <div className='m-[2rem]'>아직 댓글이 없습니다.</div>
            )}
          </div>
        </div>

        {/* 댓글 입력 영역 */}
        <div className='sticky bottom-0 w-full bg-light-white dark:bg-dark-white'>
          <CommentInput onAddComment={handleAddComment} />
        </div>
      </div>
    </div>
  )
}

export default BoardDetail