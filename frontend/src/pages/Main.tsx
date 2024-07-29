import React, { useState, useEffect } from 'react';
import Recommand from '@components/Board/Recommand';
import { detail } from '@services/boardService';
import Board from '@components/Board/Board';
import { getboardlist } from '@services/boardService';
import { useInView } from 'react-intersection-observer';

function Main() {
  const [ref, inView] = useInView();

  const [boards, setBoards] = useState<Board[]>([]);
  const [boardsPage, setboardPage] = useState<number>(0);

  const fetchBoards = async () => {
    try {
      const result = await getboardlist(boardsPage, 10);
      setboardPage(boardsPage+1)
      console.log(result)
      // setBoards((prevBoards) => [...prevBoards, result.data.data.content]);
      setBoards(result.data.data.content);
    } catch (error) {
      console.error('게시글 불러오기 실패: ', error);
    }
  };

  useEffect(() => {
    // inView가 true 일때만 실행한다.
    if (inView) {
      console.log(inView, '무한 스크롤 요청')
      fetchBoards()
      console.log(boards, boardsPage)
    }
  }, [inView]);

  const getDetail = () => {
    detail(1);
  }
  
  return (
    <div>
      <div className='flex justify-center'>
        <div className='hidden lg:block w-[15rem]'/>
        <div className='w-full md:w-[40rem]'>
          <div onClick={getDetail} className='cursor-pointer'>1번 게시글 자세히 보기</div>
          {boards?.map((board) => (
            <Board key={board.boardId} board={board} />
          ))}
        </div>
        <div>
          <Recommand />
        </div>
      </div>

      {/* intersection observer */}
      <div ref={ref}></div>
    </div> 
  )
}

export default Main;