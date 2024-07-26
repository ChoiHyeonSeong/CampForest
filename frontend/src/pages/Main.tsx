import React, { useEffect, useState } from 'react';
import Write from '@components/Board/Write'
import Recommand from '@components/Board/Recommand';
import { useDispatch, useSelector } from 'react-redux';
import { setIsBoardWriteModal } from '@store/modalSlice';
import { RootState } from '@store/store';
import { list, detail } from '@services/boardService';
import BoardList from '@components/Board/BoardList';

function Main() {
  let isBoardWriteModal = useSelector((state: RootState) => state.modalStore.isBoardWriteModal)
  let dispatch = useDispatch()

  const getDetail = () => {
    detail(1);
  }
  
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