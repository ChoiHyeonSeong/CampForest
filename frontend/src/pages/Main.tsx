import React, { useState, useEffect, useRef } from 'react';
import Recommand from '@components/Board/Recommand';
import Board from '@components/Board/Board';
import { boardList, boardDetail } from '@services/boardService';
import { useInView } from 'react-intersection-observer';
import { useDispatch } from 'react-redux';
import { setIsLoading } from '@store/modalSlice';

type BoardType = {
  boardId: number;
  userId: number;
  title: string;
  content: string;
  category: string;
  likeCount: number;
  createdAt: string;
  modifiedAt: string;
  imageUrls: string[];
  boardOpen: boolean;
}

function Main() {
  const dispatch = useDispatch();

  const [ref, inView] = useInView();

  const [boards, setBoards] = useState<Board[]>([]);
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
  }, [inView]);

  const getDetail = () => {
    boardDetail(1);
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
      <div ref={ref} className='h-1'></div>
    </div> 
  )
}

export default Main;