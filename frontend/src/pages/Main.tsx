import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";
import Board, { BoardType } from '@components/Board/Board';
import { boardDetail, boardList } from '@services/boardService';
import { useInView } from 'react-intersection-observer';
import { useDispatch } from 'react-redux';
import { setIsLoading } from '@store/modalSlice';
import { setUser } from '@store/userSlice';

import { getOAuthAccessToken } from '@services/authService';

import BoardDetail from '@components/Board/BoardDetail';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

function Main() {
  const query = useQuery();
  useEffect(() => {
    const queryCode = query.get('code')

    if (queryCode !== null) {
      const getAccessToken = async () => {
        try {
          const response = await getOAuthAccessToken(queryCode)
          dispatch(setUser(response.user));
          console.log(response)
        } catch (error) {
          console.log(error)
        }
      }

      getAccessToken()
    }
  }, []);

  const dispatch = useDispatch();

  const [ref, inView] = useInView();

  const [boards, setBoards] = useState<BoardType[]>([]);
  const [nextPageExist, setNextPageExist] = useState(true);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<BoardType | null>(null);

  const boardCursorIdRef = useRef<number | null>(null);

  const fetchBoards = async () => {
    try {
      dispatch(setIsLoading(true))
      const response = await boardList(boardCursorIdRef.current, 10);
      dispatch(setIsLoading(false))
      boardCursorIdRef.current = response.data.data.nextCursor
      if (!response.data.data.hasNext) {
        setNextPageExist(false);
      }
      setBoards((prevBoards) => [...prevBoards, ...response.data.data.content]);
    } catch (error) {
      dispatch(setIsLoading(false))
      console.error('게시글 불러오기 실패: ', error);
    }
  };

  const pageReload = () => {
    boardCursorIdRef.current = null
    setBoards([]);
    setNextPageExist(true);

    fetchBoards()
  }

  useEffect(() => {
    pageReload()
  }, [])

  useEffect(() => {
    // inView가 true 일때만 실행한다.
    if (inView && nextPageExist) {
      console.log(inView, '무한 스크롤 요청')
      fetchBoards()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [inView]);

  const detailClose = () => {
    setIsDetailOpen(false)
  }

  const detailOpen = (selectedId: number) => {
    const selected = boards.find(board => {
      return Number(board.boardId) === selectedId
    })
    if (selected) {
      setSelectedDetail(selected)
      setIsDetailOpen(true)
    }
  }

  useEffect(() => {
    const selected = boards.find(board => {
      return Number(board.boardId) === selectedDetail?.boardId
    })
    if (selected) {
      setSelectedDetail(selected)
    }
  }, [boards])

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
    setBoards(prevBoards =>
      prevBoards.map(board =>
        board.boardId === boardId
          ? { ...board, saved: isSaved }
          : board
      )
    );
  }

  return (
    <div>
      {/* 디테일 모달 */}
      {
        isDetailOpen && selectedDetail !== null ? (
          <BoardDetail selectedBoard={selectedDetail} detailClose={detailClose} pageReload={pageReload} updateComment={updateComment} updateLike={updateLike} updateSaved={updateSaved}/>
        ) : (
          <></>
        )
      }
    
      {/* 본문 */}
      <div className={`flex justify-center`}>
        <div className={`w-[100%] md:w-[40rem]`}>
          {boards?.map((board, index) => (
            <div className={`my-[1.25rem]`} key={board.boardId}>
              <Board board={board} deleteFunction={pageReload} isDetail={false} detailOpen={detailOpen} updateLike={updateLike} updateSaved={updateSaved}/>
            </div>
          ))}
        </div>
        {/* <div>
          <Recommand />
        </div> */}
      </div>

      {/* intersection observer */}
      <div ref={ref} className={`${boards.length >= 1 ? 'block' : 'hidden'} h-[0.25rem]`}></div>
    </div> 
  )
}

export default Main;