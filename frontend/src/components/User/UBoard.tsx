import React, { useState, useEffect, useRef } from 'react';

import { ReactComponent as ArticleIcon } from '@assets/icons/article-outline.svg';
import { ReactComponent as BookMarkIcon } from '@assets/icons/bookmark.svg';
import { ReactComponent as FilterIcon } from '@assets/icons/filter2.svg';

import { useParams } from 'react-router-dom';
import Board, { BoardType } from '@components/Board/Board';

import { useDispatch, useSelector } from 'react-redux';

import { boardUserList, savedList } from '@services/boardService';
import { setIsLoading } from '@store/modalSlice';
import { useInView } from 'react-intersection-observer';
import { RootState } from '@store/store';

type Props = {};

const UBoard = (props: Props) => {
  const [myBoard, setMyBoard] = useState(true);
  const userId = Number(useParams().userId);
  const userState = useSelector((state: RootState) => state.userStore);
  const dispatch = useDispatch();
  const [ref, inView] = useInView();
  const [savedRef, savedInView] = useInView();
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [savedBoards, setSavedBoards] = useState<BoardType[]>([]);
  const [nextPageExist, setNextPageExist] = useState(true);
  const [nextSavedPageExist, setNextSavedPageExist] = useState(true);
  const isFirstLoadRef = useRef(true);
  const isFirstSavedLoadRef = useRef(true);
  const boardPageRef = useRef(0);
  const savedBoardPageRef = useRef(0);

  const fetchBoards = async () => {
    try {
      dispatch(setIsLoading(true));
      const result = await boardUserList(userId, boardPageRef.current, 10);
      dispatch(setIsLoading(false));

      boardPageRef.current += 1;
      if (result.data.data.last) {
        setNextPageExist(false);
      }
      setBoards((prevBoards) => [...prevBoards, 
        ...result.data.data.content]);
    } catch (error) {
      dispatch(setIsLoading(false));
      console.error('게시글 불러오기 실패: ', error);
    }
  };

  async function fetchSavedBoard () {
    try {
      dispatch(setIsLoading(true));
      const result = await savedList(savedBoardPageRef.current, 10);
      dispatch(setIsLoading(false));

      savedBoardPageRef.current += 1;
      if (result.data.data.last) {
        setNextSavedPageExist(false);
      }
      setSavedBoards((prevBoards) => [...prevBoards, ...result.data.data.content]);

      
      
    } catch (error) {
      dispatch(setIsLoading(false));
      console.error('저장된 게시글 불러오기 실패: ', error);
    }
  }

  const pageReload = () => {
    isFirstLoadRef.current = true;
    isFirstSavedLoadRef.current = true;
    fetchBoards();
    fetchSavedBoard();
  };

  useEffect(() => {
    pageReload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    // inView가 true 일때만 실행한다.
    if (inView && nextPageExist) {
      console.log(inView, '작성글 무한 스크롤 요청');
      fetchBoards();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    // inView가 true 일때만 실행한다.
    if (savedInView && nextSavedPageExist) {
      console.log(inView, '저장됨 무한 스크롤 요청');
      fetchSavedBoard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedInView]);

  function handleType (myBoard: boolean) {
    if (myBoard) {
      setMyBoard(true);
    } else {
      setMyBoard(false);
    }
  }

  return (
    <div className={`px-[4rem]`}>
      <div>
        {/* 작성글, 저장됨, 필터 */}
        <div
          className={`
            flex justify-center relative mt-[1.5rem] mb-[1.5rem]
          `}
        >
          {/* 작성글 */}
          <div
            onClick={() => handleType(true)}
            className={`
              ${myBoard ? 'font-bold' : 'text-light-text-secondary'}
              flex items-center
            `}
          >
            <ArticleIcon 
              className={`
                ${myBoard ? 'fill-light-black' : 'fill-light-gray-1'}
                size-[1rem]
              `}
            />
            <span
              className={`
                ms-[0.5rem]
                text-[0.875rem]
              `}
            >
              작성글 {boards.length}
            </span>
          </div>
          {/* 북마크 */}
          <div 
            onClick={() => handleType(false)}
            className={`
              ${userId !== userState.userId ? 'hidden' : ''}
              flex items-center ms-[2.5rem]
            `}
          >
            <BookMarkIcon 
              className={`
                ${myBoard ? 'fill-light-gray-1' : ''}
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
              저장됨 {savedBoards.length}
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

      <div className={`${myBoard ? '' : 'hidden'}`}>
        {boards?.map((board, index) => (
          <div className={`my-[1.25rem]`} key={index}>
            <Board board={board} deleteFunction={pageReload} isDetail={false} />
          </div>
        ))}
      

        <div ref={ref} className={`${isFirstLoadRef.current ? 'hidden' : 'block'} h-[0.25rem]`}></div>
      </div>
      <div className={`${myBoard ? 'hidden' : ''}`}>
        {savedBoards?.map((board, index) => (
          <div className={`my-[1.25rem]`} key={index}>
            <Board board={board} deleteFunction={pageReload} isDetail={false} />
          </div>
        ))}
      

        <div ref={savedRef} className={`${isFirstLoadRef.current ? 'hidden' : 'block'} h-[0.25rem]`}></div>
      </div>
    </div>
  );
};

export default UBoard;
