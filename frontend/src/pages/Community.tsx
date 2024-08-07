import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom'
import { boardList, filteredBoardList } from '@services/boardService';
import Board, { BoardType } from '@components/Board/Board';
import { useInView } from 'react-intersection-observer';
import { useDispatch } from 'react-redux';
import { setIsLoading } from '@store/modalSlice';

const Community = () => {
  const dispatch = useDispatch();

  const params = useParams();
  const category = params.category ?? 'all'

  const [ref, inView] = useInView();

  const [boards, setBoards] = useState<BoardType[]>([]);
  const [nextPageExist, setNextPageExist] = useState(true);

  const boardCursorIdRef = useRef<number | null>(null);

  const fetchBoards = async () => {
    try {
      dispatch(setIsLoading(true))
      let response: any;
      if (category === 'all') {
        response = await boardList(boardCursorIdRef.current, 10);
      } else {
        response = await filteredBoardList(category, boardCursorIdRef.current, 10);
      }
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
  }, [category])

  useEffect(() => {
    if (inView && nextPageExist) {
      console.log(inView, '무한 스크롤 요청');
      fetchBoards();
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
      </div>

      {/* intersection observer */}
      <div ref={ref} className={`${boards.length >= 1 ? 'block' : 'hidden'} h-[0.25rem]`}></div>
    </div>
  )
}

export default Community