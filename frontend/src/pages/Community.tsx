import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom'
import { boardList, filteredBoardList } from '@services/boardService';
import Board from '@components/Board/Board';
import { useInView } from 'react-intersection-observer';

const Community = () => {
  const params = useParams();
  const category = params.category ?? 'all'

  const [ref, inView] = useInView();

  const [boards, setBoards] = useState<Board[]>([]);
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

      let result: any;
      
      if (category === 'all') {
        result = await boardList(boardPageRef.current, 10);
      } else {
        result = await filteredBoardList(category, boardPageRef.current, 10);
      }

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
      console.error('게시글 불러오기 실패: ', error);
    }
  };

  useEffect(() => {
    if (inView && nextPageExist) {
      console.log(inView, '무한 스크롤 요청');
      fetchBoards();
    }
  }, [inView]);

  useEffect(() => {
    isFirstLoadRef.current = true
    fetchBoards(true)
  }, [category])

  return (
    <div>
      <div className='flex justify-center'>
        <div className='hidden lg:block w-[15rem]'/>
        <div className='w-full md:w-[40rem]'>
          {boards?.map((board, index) => (
            <Board key={index} board={board} />
          ))}
        </div>
      </div>

      {/* intersection observer */}
      <div ref={ref} className={`h-1 ${isFirstLoadRef.current ? 'hidden' : 'block'}`}></div>
    </div>
  )
}

export default Community