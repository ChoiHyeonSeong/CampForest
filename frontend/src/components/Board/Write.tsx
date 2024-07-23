import React from 'react'
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg' 
import { ReactComponent as ArrowBottomIcon } from '@assets/icons/arrow-bottom.svg'
import { ReactComponent as ArrowLeftIcon } from '@assets/icons/arrow-left.svg'

type Props = {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Write = (props: Props) => {
  return (
    <div className='overflow-auto md:mx-auto h-[100%] md:mt-[8%] md:w-[40rem] bg-white md:rounded-md p-4 md:p-12'>
      <div className='flex items-center mb-4 md:mb-8'>
        <div><ArrowLeftIcon onClick={() => props.setIsModalOpen(false)} className='md:hidden md:size-8 cursor-pointer' fill='000000' /></div>
        <div className='ms-4 font-bold text-2xl'>글 쓰기</div>
        <div className='ms-auto'><CloseIcon onClick={() => props.setIsModalOpen(false)} className='hidden md:block md:size-8 cursor-pointer' fill='000000' /></div>
      </div>
      <div className='flex'>
        <div className='ms-4 border-b md:border border-black md:rounded-md md:px-4 py-[0.3rem]'>
          카테고리
          <ArrowBottomIcon className='ms-6 inline size-[1rem]'/>
        </div>
        <div className='ms-auto text-sm md:text-md text-blue-600'>공개 범위 : _______</div>
      </div>
      <form className='flex flex-col my-2 md:my-8'>
        <input 
          className='border-b py-2 ps-4 md:text-lg focus:outline-none'
          placeholder='제목을 입력하세요.'
        />
        <textarea 
          className='resize-none py-2 ps-4 md:text-lg h-[22rem] focus:outline-none mb-[2rem]'
          placeholder='내용을 입력하세요.'
        />
        <div className='flex fixed bottom-0 md:static'>
          <div className='size-[6rem] md:size-[8rem] rounded-md bg-gray-300 mb-28 md:mb-0'></div>
        </div>
      </form>
      <div className='md:text-center -m-4'>
        <button className='fixed bottom-11 md:static py-3 w-full bg-black text-white md:bg-white md:text-black md:hover:bg-black md:hover:text-white transition duration-300 text-center md:border border-black md:rounded-md md:py-1 md:w-[15rem]'>등록</button>
      </div>
    </div>
  )
}

export default Write;