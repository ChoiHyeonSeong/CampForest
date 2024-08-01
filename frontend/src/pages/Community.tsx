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

  const isFirstLoadRef = useRef(true);
  const boardPageRef = useRef(0);

  const fetchBoards = async (reset = false) => {
    try {
      if (reset) {
        boardPageRef.current = 0
        setBoards([]);
        setNextPageExist(true);
      }

      dispatch(setIsLoading(true))
      let result: any;
      if (category === 'all') {
        result = await boardList(boardPageRef.current, 10);
      } else {
        result = await filteredBoardList(category, boardPageRef.current, 10);
      }
      dispatch(setIsLoading(false))
      if (!result.data.data.empty && !result.data.data.last) {
        boardPageRef.current += 1
      }
      if (reset) {
        isFirstLoadRef.current = false;
      } 
      if (result.data.data.last) {
        setNextPageExist(false);
      }
      setBoards((prevBoards) => [...prevBoards, ...result.data.data.content]);
    } catch (error) {
      dispatch(setIsLoading(false))
      console.error('게시글 불러오기 실패: ', error);
    }
  };

  useEffect(() => {
    if (inView && nextPageExist) {
      console.log(inView, '무한 스크롤 요청');
      fetchBoards();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [inView]);

  useEffect(() => {
    isFirstLoadRef.current = true
    fetchBoards(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [category])

  const pageReload = () => {
    isFirstLoadRef.current = true
    fetchBoards(true)
  }

  return (
    <div>
      <div className={`flex justify-center`}>
        <div className={`hidden lg:block w-[15rem]`}/>
        <div className={`w-[100%] md:w-[40rem]`}>
          {boards?.map((board, index) => (
            <div className={`my-[1.25rem]`} key={index}>
              <Board board={board} deleteFunction={pageReload} isDetail={false}/>
            </div>
          ))}
        </div>
      </div>

      {/* intersection observer */}
      <div ref={ref} className={`${isFirstLoadRef.current ? 'hidden' : 'block'} h-[0.25rem]`}></div>
    </div>
  )
}

export default Community