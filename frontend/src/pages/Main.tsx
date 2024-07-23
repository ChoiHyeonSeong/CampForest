import React, { useState } from 'react';
import Board from '@components/Board/Board'
import Write from '@components/Board/Write'
import Recommand from '@components/Board/Recommand';

function Main() {
  const [isModalOpen, setIsModalOpen] = useState(true)

  return (
    <div className='flex justify-center'>
      <div 
        onClick={() => setIsModalOpen(false)} 
        className={`${isModalOpen ? '' : 'hidden'} fixed z-10 md:items-center w-full h-full bg-black bg-opacity-70`}>
        <div className="h-full md:w-[40rem] md:h-[90%] md:mx-auto" onClick={(event) => event.stopPropagation()}>
          <Write />
        </div>
      </div>
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