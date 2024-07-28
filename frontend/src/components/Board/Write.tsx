import React, { useState } from 'react'
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg' 
import { ReactComponent as ArrowBottomIcon } from '@assets/icons/arrow-bottom.svg'
import { ReactComponent as ArrowLeftIcon } from '@assets/icons/arrow-left.svg'
import { useDispatch, useSelector } from 'react-redux'
import { setIsBoardWriteModal } from '@store/modalSlice'
import { write } from '@services/boardService'
import { RootState } from '@store/store'

const Write = () => {
  const user = useSelector((state: RootState) => state.userStore);
  const isBoardWriteModal = useSelector((state: RootState) => state.modalStore.isBoardWriteModal)
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('카테고리');
  const [boardOpen, setBoardOpen] = useState(true);

  const dispatch = useDispatch()
  const handleWrite = async (e: React.FormEvent) => {
    e.preventDefault(); 
    try {
      await write(user.userId, title, content, category, boardOpen);
      dispatch(setIsBoardWriteModal(false));
    } catch (error) {
      
    }
  }
  return (
    <div 
    onClick={() => dispatch(setIsBoardWriteModal(false))} 
    className={`${isBoardWriteModal ? 'block' : 'hidden'} fixed z-20 md:items-center w-full h-full bg-black bg-opacity-70 inset-0`}>
      <div className="h-full md:w-[40rem] md:h-[90%] md:mx-auto" onClick={(event) => event.stopPropagation()}>
        <div className='overflow-auto md:mx-auto h-[calc(100vh-5.95rem)] md:h-[85%] md:mt-[15%] md:w-[35rem] bg-white md:rounded-md p-4 md:px-[2rem] md:py-[3rem]'>
          <div className='flex items-center mb-[2rem]'>
            <div><ArrowLeftIcon onClick={() => dispatch(setIsBoardWriteModal(false))} className='md:hidden md:size-8 cursor-pointer' fill='000000' /></div>
            <div className='ms-4 font-bold text-2xl'>글 쓰기</div>
            <div className='ms-auto'><CloseIcon onClick={() => dispatch(setIsBoardWriteModal(false))} className='hidden md:block md:size-[1.5rem] cursor-pointer' fill='000000' /></div>
          </div>
          <div className='flex items-baseline'>
            <div className='ms-4 border-b md:border border-black md:rounded-md md:px-4 py-[0.3rem]'>
              {category}
              <ArrowBottomIcon className='ms-6 inline size-[1rem]'/>
            </div>
            <div className='ms-auto text-sm md:text-md text-blue-600'>공개 범위 : _______</div>
          </div>
          <form 
            onSubmit={handleWrite}
            className='flex flex-col my-2'>
            <input 
              className='border-b py-2 ps-4 focus:outline-none'
              placeholder='제목을 입력하세요.'
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea 
              className='resize-none py-2 ps-4 h-[17rem] focus:outline-none mb-[2rem]'
              placeholder='내용을 입력하세요.'
              onChange={(e) => setContent(e.target.value)}
            />
            <div className='flex fixed bottom-0 md:static'>
              <div className='size-[6rem] rounded-md bg-gray-300 mb-28 md:mb-[2rem]'></div>
            </div>
          <div className='md:text-center -m-4'>
            <button className='fixed bottom-11 md:static py-3 w-full bg-black text-white md:bg-white md:text-black md:hover:bg-black md:hover:text-white transition duration-300 text-center md:border border-black md:rounded-md md:py-1 md:w-[15rem]'>등록</button>
          </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Write;