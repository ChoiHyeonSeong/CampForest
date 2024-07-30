import React, { useState, useEffect, useRef } from 'react';
import Recommand from '@components/Board/Recommand';
import Board, { BoardType } from '@components/Board/Board';
import { boardList, boardDetail } from '@services/boardService';
import { useInView } from 'react-intersection-observer';
import { useDispatch } from 'react-redux';
import { setIsLoading } from '@store/modalSlice';

function Main() {
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
      boardPageRef.current += 1
      if (result.data.data.last) {
        setNextPageExist(false);
      }
      console.log(result.data)
      setBoards((prevBoards) => [...prevBoards, ...result.data.data.content]);
    } catch (error) {
      console.error('게시글 불러오기 실패: ', error);
    }
  };

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
      <div className='flex justify-center'>
        <div className='hidden lg:block w-[15rem]'/>
        <div className='w-full md:w-[40rem]'>
          {boards?.map((board) => (
            <Board key={board.boardId} board={board} />
          ))}
        </div>
        <div>
          <Recommand />
        </div>
      </div>

      {/* intersection observer */}
      <div ref={ref} className='h-1'></div>
    </div> 
  )
}

export default Main;