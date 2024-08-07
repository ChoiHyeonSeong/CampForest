import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";
import Board, { BoardType } from '@components/Board/Board';
import { boardList } from '@services/boardService';
import { useInView } from 'react-intersection-observer';
import { useDispatch } from 'react-redux';
import { setIsLoading } from '@store/modalSlice';
import { setUser } from '@store/userSlice';

import { getOAuthAccessToken } from '@services/authService';

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

  const boardPageRef = useRef(0);

  const fetchBoards = async () => {
    try {
      dispatch(setIsLoading(true))
      const result = await boardList(boardPageRef.current, 10);
      dispatch(setIsLoading(false))

      if (result.data) {
        boardPageRef.current += 1
        if (result.data.data.last) {
          setNextPageExist(false);
        }
        setBoards((prevBoards) => [...prevBoards, ...result.data.data.content]);
      }
    } catch (error) {
      dispatch(setIsLoading(false))
      console.error('게시글 불러오기 실패: ', error);
    }
  };

  const pageReload = () => {
    boardPageRef.current = 0
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

  return (
    <div>
      <div className={`flex justify-center`}>
        <div className={`w-[100%] md:w-[40rem]`}>
          {boards?.map((board, index) => (
            <div className={`my-[1.25rem]`} key={index}>
              <Board board={board} deleteFunction={pageReload} isDetail={false}/>
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