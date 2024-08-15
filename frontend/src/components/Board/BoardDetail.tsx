import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Board from './Board';
import BoardComment, { CommentType } from './BoardComment';
import CommentInput from './CommentInput';
import { BoardType } from '@components/Board/Board';
import { commentList, commentWrite } from '@services/commentService';
import { ReactComponent as LeftIcon } from '@assets/icons/arrow-left.svg';
import { RootState } from '@store/store';

import Swal from 'sweetalert2'

type Props = {
  selectedBoard: BoardType;
  detailClose: () => void;
  pageReload: () => void;
  updateComment: (boardId: number, commentCount: number) => void;
  updateLike: (boardId: number, isLiked: boolean, likedCount: number) => void;
  updateSaved: (boardId: number, isSaved: boolean) => void;
  modifyOpen? : (param: number) => void;
}

const BoardDetail = (props: Props) => {
  const [show, setShow] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [screenSize, setScreenSize] = useState<'mobile' | 'desktop'>('desktop');
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.userStore.isLoggedIn);

  const popLoginAlert = () => {
    Swal.fire({
      icon: "error",
      title: "로그인 해주세요.",
      text: "로그인 후 사용가능합니다.",
      confirmButtonText: '확인'
    }).then(result => {
      if (result.isConfirmed) {
        navigate('/user/login')
      }
    });
  }

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth <= 768 ? 'mobile' : 'desktop');
    };

    handleResize();
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

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const result = await commentList(props.selectedBoard.boardId);
      setComments(result.content);
      if (props.selectedBoard) {
        props.updateComment(props.selectedBoard.boardId, result.totalElements);
      }
    } catch (error) {
      console.error('댓글 불러오기 실패: ', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    if (show) {
      window.history.pushState({ modal: true }, '');
      const handlePopState = (event: PopStateEvent) => {
        if (!(event.state && event.state.modal)) {
          handleDetailClose();
        }
      };
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [show]);

  const handleAddComment = async (comment: string) => {
    if (!isLoggedIn) {
      popLoginAlert()
      return;
    }
    try {
      await commentWrite(props.selectedBoard.boardId, comment);
      fetchComments();
    } catch (error) {
      console.error('댓글 작성 실패: ', error);
    }
  };
  
  const handleDetailClose = useCallback((e?: React.MouseEvent) => {
    if (screenSize === 'mobile' || (e && e.target === e.currentTarget)) {
      setShow(false);
      setTimeout(() => {
        props.detailClose();
        window.history.back();
      }, 300);
    }
  }, [screenSize, props.detailClose]);
  
  const deleteFunction = () => {
    props.pageReload();
    setShow(false);
    setTimeout(() => {
      props.detailClose();
    }, 300);
  };

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
          ${screenSize === 'mobile' ? 'fixed inset-y-0 right-0 left-0 w-full h-[calc(100vh-3.2rem)] mb-[3.2rem]' : 
            'mx-auto my-8 max-w-[40rem] max-h-[calc(100vh-4rem)]'}
          z-[110] bg-light-white dark:bg-dark-white
          flex flex-col
          transition-all duration-300 ease-in-out
          ${screenSize !== 'mobile' ? 'rounded-md' : ''}
        `}
      >
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
              modifyOpen={props.modifyOpen}
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