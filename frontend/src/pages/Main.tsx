import React from 'react';
import Board from '@components/Board/Board'

function Main() {
  return (
    <div className='flex justify-center'>
      <div className='w-full md:w-[40rem]'>
        <Board />
        <Board />
        <Board />
        <Board />
        <Board />
        <Board />
        <Board />

      </div>
    </div>
  )
}

export default Main;