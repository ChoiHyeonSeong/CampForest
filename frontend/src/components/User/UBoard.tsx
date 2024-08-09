import React, { useState, useEffect, useRef } from 'react';

import { ReactComponent as ArticleIcon } from '@assets/icons/article-outline.svg';
import { ReactComponent as BookMarkIcon } from '@assets/icons/bookmark.svg';
import { ReactComponent as FilterIcon } from '@assets/icons/filter2.svg';

import { useParams, useLocation } from 'react-router-dom';
import Board, { BoardType } from '@components/Board/Board';

import { useDispatch, useSelector } from 'react-redux';

import { boardUserList, savedList } from '@services/boardService';
import { setIsLoading } from '@store/modalSlice';
import { useInView } from 'react-intersection-observer';
import { RootState } from '@store/store';
import BoardDetail from '@components/Board/BoardDetail';

type Props = {};

const UBoard = (props: Props) => {
  const [myBoard, setMyBoard] = useState(true);
  const userState = useSelector((state: RootState) => state.userStore);
  const userId = Number(useParams().userId);

  const currentLoc = useLocation(); 
  const dispatch = useDispatch();

  const [ref, inView] = useInView();
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [nextPageExist, setNextPageExist] = useState(true);
  const boardCursorIdRef = useRef<number | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<number | null>(null);

  const [totalBoardCnt, setTotalBoardCnt] = useState(0);
  const [totalSavedBoardCnt, setTotalSavedBoardCnt] = useState(0);

  const fetchBoards = async () => {
    try {
      dispatch(setIsLoading(true));
      const response = await boardUserList(userId, boardCursorIdRef.current, 10);
      dispatch(setIsLoading(false));

      console.log(response)
      boardCursorIdRef.current = response.data.data.nextCursor
      if (!response.data.data.hasNext) {
        setNextPageExist(false);
      }
      setBoards((prevBoards) => [...prevBoards, ...response.data.data.content]);
    } catch (error) {
      dispatch(setIsLoading(false));
      console.error('게시글 불러오기 실패: ', error);
    }
  };

  const fetchSavedBoard = async () => {
    try {
      dispatch(setIsLoading(true));
      const response = await savedList(boardCursorIdRef.current, 10);
      dispatch(setIsLoading(false));
      boardCursorIdRef.current = response.data.data.nextCursor
      if (!response.data.data.hasNext) {
        setNextPageExist(false);
      }
      setBoards((prevBoards) => [...prevBoards, ...response.data.data.content]);
    } catch (error) {
      dispatch(setIsLoading(false));
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
    setSelectedDetail(selectedId)
    setIsDetailOpen(true)
  }

  useEffect(() => {
    const contentBox = document.querySelector('#contentBox') as HTMLElement;
    if (isDetailOpen) {
      contentBox.classList.add('md:scrollbar-hide')
    } else {
      contentBox.classList.remove('md:scrollbar-hide')
    }
  }, [isDetailOpen])

  return (
    <div className={`px-[4rem]`}>
      {/* 디테일 모달 */}
      {
        isDetailOpen && selectedDetail !== null ? (
          <BoardDetail selectedBoardId={selectedDetail} detailClose={detailClose} elementReload={pageReload}/>
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
          <div className={`my-[1.25rem]`} key={index}>
            <Board board={board} deleteFunction={pageReload} isDetail={false} detailOpen={detailOpen}/>
          </div>
        ))}
      

        <div ref={ref} className={`${boards.length >= 1 ? 'block' : 'hidden'} h-[0.25rem]`}></div>
      </div>
    </div>
  );
};

export default UBoard;