import React, { useState, useEffect, useRef } from 'react';

import { ReactComponent as ArticleIcon } from '@assets/icons/article-outline.svg';
import { ReactComponent as BookMarkIcon } from '@assets/icons/bookmark.svg';
import { ReactComponent as FilterIcon } from '@assets/icons/filter2.svg';

import { useParams, useLocation } from 'react-router-dom';
import Board, { BoardType } from '@components/Board/Board';

import { useSelector } from 'react-redux';

import { boardUserList, savedList } from '@services/boardService';
import { useInView } from 'react-intersection-observer';
import { RootState } from '@store/store';
import BoardDetail from '@components/Board/BoardDetail';

type Props = {};

const UBoard = (props: Props) => {
  const [myBoard, setMyBoard] = useState(true);
  const userState = useSelector((state: RootState) => state.userStore);
  const userId = Number(useParams().userId);
  const currentLoc = useLocation(); 
  const [ref, inView] = useInView();
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [nextPageExist, setNextPageExist] = useState(true);
  const boardCursorIdRef = useRef<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<BoardType | null>(null);
  const [totalBoardCnt, setTotalBoardCnt] = useState(0);
  const [totalSavedBoardCnt, setTotalSavedBoardCnt] = useState(0);
  const [visibleBoards, setVisibleBoards] = useState<number[]>([]);

  const fetchBoards = async () => {
    try {
      const response = await boardUserList(userId, boardCursorIdRef.current, 10);

      console.log(response)
      boardCursorIdRef.current = response.data.data.nextCursor
      if (!response.data.data.hasNext) {
        setNextPageExist(false);
      }
      setBoards((prevBoards) => [...prevBoards, ...response.data.data.content]);
    } catch (error) {
      console.error('게시글 불러오기 실패: ', error);
    }
  };

  const fetchSavedBoard = async () => {
    try {
      const response = await savedList(boardCursorIdRef.current, 10);
      boardCursorIdRef.current = response.data.data.nextCursor
      if (!response.data.data.hasNext) {
        setNextPageExist(false);
      }
      setBoards((prevBoards) => [...prevBoards, ...response.data.data.content]);
    } catch (error) {
      console.error('저장된 게시글 불러오기 실패: ', error);
    }
  }

  const pageReload = (isSaved: boolean = true) => {
    boardCursorIdRef.current = null
    setBoards([]);
    setNextPageExist(true);

    if (isSaved) {
      fetchSavedBoard();
    } else {
      fetchBoards();
    }
  };

  useEffect(() => {
    if (myBoard) {
      pageReload(false)
    } else {
      pageReload(true)
    }
  }, [myBoard, currentLoc.pathname])

  useEffect(() => {
    // inView가 true 일때만 실행한다.
    if (inView && nextPageExist) {
      console.log(inView, '작성글 무한 스크롤 요청');
      if (myBoard) {
        fetchBoards();
      } else {
        fetchSavedBoard();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const getCnt = async () => {
    const response1 = await boardUserList(userId, null, 1);
    if (userState.userId === userId) {
      const response2 = await savedList(null, 1); 
      setTotalSavedBoardCnt(response2.data.data.totalCount)
    }
    setTotalBoardCnt(response1.data.data.totalCount)
  }

  useEffect(() => {
    getCnt()
  }, [])

  const detailClose = () => {
    setIsDetailOpen(false)
  }

  const detailOpen = (selectedId: number) => {
    const selected = boards.find(board => {
      return Number(board.boardId) === selectedId
    })
    console.log(selected)
    if (selected) {
      setSelectedDetail(selected)
      setIsDetailOpen(true)
    }
  }

  useEffect(() => {
    const contentBox = document.querySelector('#contentBox') as HTMLElement;
    if (isDetailOpen) {
      contentBox.classList.add('md:scrollbar-hide')
    } else {
      contentBox.classList.remove('md:scrollbar-hide')
    }
  }, [isDetailOpen])

  const updateComment = async (boardId: number, commentCount: number) => {
    setBoards(prevBoards =>
      prevBoards.map(board =>
        board.boardId === boardId
          ? { ...board, commentCount: commentCount }
          : board
      )
    );
  }

  const updateLike = async (boardId: number, isLiked: boolean, likedCount: number) => {
    setBoards(prevBoards =>
      prevBoards.map(board =>
        board.boardId === boardId
          ? { ...board, likeCount: likedCount, liked: isLiked } // 좋아요 수를 1 증가시킴
          : board
      )
    );
  };

  const updateSaved = async (boardId: number, isSaved: boolean) => {
    console.log(isSaved)
    setBoards(prevBoards =>
      prevBoards.map(board =>
        board.boardId === boardId
          ? { ...board, saved: isSaved }
          : board
      )
    );
  }

  useEffect(() => {
    boards.forEach((board, index) => {
      setTimeout(() => {
        setVisibleBoards(prev => [...prev, board.boardId]);
      }, index * 100); // 각 게시물마다 100ms 지연
    });
  }, [boards])

  return (
    <div className={`px-[4rem]`}>
      {/* 디테일 모달 */}
      {
        isDetailOpen && selectedDetail !== null ? (
          <BoardDetail selectedBoard={selectedDetail} detailClose={detailClose} pageReload={pageReload} updateComment={updateComment} updateLike={updateLike} updateSaved={updateSaved}/>
        ) : (
          <></>
        )
      }
      
      {/* 본문 */}
      <div>
        {/* 작성글, 저장됨, 필터 */}
        <div
          className={`
            flex justify-center relative mt-[1.5rem] mb-[1.5rem]
          `}
        >
          {/* 작성글 */}
          <div
            onClick={() => setMyBoard(true)}
            className={`
              ${myBoard ? 'font-bold' : 'text-light-text-secondary'}
              flex items-center
            `}
          >
            <ArticleIcon 
              className={`
                ${myBoard ? 'fill-light-black dark:fill-dark-black' : 'fill-light-gray-1 dark:fill-dark-gray-1'}
                size-[1rem]
              `}
            />
            <span
              className={`
                ms-[0.5rem]
                text-[0.875rem]
              `}
            >
              작성글 {totalBoardCnt}
            </span>
          </div>

          {/* 북마크 */}
          <div 
            onClick={() => setMyBoard(false)}
            className={`
              ${userState.userId === userId ? '' : 'hidden'}
              flex items-center ms-[2.5rem]
            `}
          >
            <BookMarkIcon 
              className={`
                ${myBoard ? 'fill-light-gray-1 dark:fill-dark-gray-1' : 'fill-light-black dark:fill-dark-black'}
                size-[1.25rem]
              `}
            />
            <span
              className={`
                ${!myBoard ? 'font-bold' : 'text-light-text-secondary'}
                ms-[0.5rem]
                text-[0.875rem]
              `}
            >
              저장됨 {totalSavedBoardCnt}
            </span>
          </div>

          {/* 필터 */}
          <div className="flex justify-end absolute right-0">
            <div className="flex items-center ms-auto px-[0.5rem] text-sm">
              <div
                className={`
                ms-[0.5rem]
                text-[0.875rem]
              `}
              >
                필터
              </div>
              <FilterIcon
                className={`
                size-[1.25rem] ms-[0.5rem] 
                fill-light-border-icon 
                dark:fill-dark-border-icon
              `}
              />
            </div>
          </div>

        </div>
      </div>

      <div>
        {boards?.map((board, index) => (
          <div 
            className={`my-[1.25rem] ${visibleBoards.includes(board.boardId) ? 'fade-in-down' : 'opacity-0'}`} 
            key={board.boardId}
          >
            <Board
              board={board}
              deleteFunction={pageReload}
              isDetail={false}
              detailOpen={detailOpen}
              updateLike={updateLike}
              updateSaved={updateSaved}
            />
          </div>
        ))}
        <div ref={ref} className={`${boards.length >= 1 ? 'block' : 'hidden'} h-[0.25rem]`}></div>
      </div>
    </div>
  );
};

export default UBoard;