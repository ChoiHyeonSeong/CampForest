import React from 'react';
import Board from '@components/Board/Board'
import Write from '@components/Board/Write'
import Recommand from '@components/Board/Recommand';
import { useDispatch, useSelector } from 'react-redux';
import { setIsBoardWriteModal } from '@store/modalSlice';
import { RootState } from '@store/store';

function Main() {
  let isBoardWriteModal = useSelector((state: RootState) => state.modalStore.isBoardWriteModal)
  let dispatch = useDispatch()

  return (
    <div className='flex justify-center'>
      <div className='hidden lg:block w-[15rem]'/>
      <div 
        onClick={() => dispatch(setIsBoardWriteModal(false))} 
        className={`${isBoardWriteModal ? '' : 'hidden'} fixed z-10 md:items-center w-full h-full bg-black bg-opacity-70`}>
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