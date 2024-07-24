import React from 'react';
import Board from '@components/Board/Board'
import Recommand from '@components/Board/Recommand';

function Main() {
  return (
    <div className='flex justify-center'>
      <div className='hidden lg:block w-[15rem]'/>
      <div className='w-full md:w-[40rem]'>
        <Board />
        <Board />
        <Board />
        <Board />
        <Board />
        <Board />
        <Board />
      </div>
      <div>
        <Recommand />
      </div>
    </div>
  )
}

export default Main;