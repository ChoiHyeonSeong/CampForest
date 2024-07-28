import React from 'react';
import Recommand from '@components/Board/Recommand';
import { detail } from '@services/boardService';
import BoardList from '@components/Board/BoardList';

function Main() {
  const getDetail = () => {
    detail(1);
  }
  
  return (
    <div className='flex justify-center'>
      <div className='hidden lg:block w-[15rem]'/>
      <div className='w-full md:w-[40rem]'>
        <div onClick={getDetail} className='cursor-pointer'>1번 게시글 자세히 보기</div>
        <BoardList />
      </div>
      <div>
        <Recommand />
      </div>
    </div>
  )
}

export default Main;