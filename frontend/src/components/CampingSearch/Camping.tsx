import React from 'react'

type Props = {
  modalOpen: () => void;
}

const Camping = (props: Props) => {
  return (
    <div onClick={props.modalOpen} className='flex md:min-w-[25rem] w-full'>
      <div className='bg-gray-300 w-1/3 max-w-[8rem] aspect-1 m-[1rem]'></div>
      <div className='py-[0.25rem] w-2/3 sm:w-3/4 my-[1rem]'>
        <div className='md:flex items-baseline mb-[0.25rem]'>
          <div className='text-2xl me-[0.5rem]'>OO캠핑장</div>
          <div className='text-xs'>OO시 OO구 OO로 OO-OO</div>
        </div>
        <div className='flex max-md:hidden ms-[0.1rem] space-x-[0.5rem] text-xs mb-[0.25rem]'>
          <button className='bg-gray-300 py-[0.1rem] px-[0.25rem] rounded-md'>무료</button>
          <button className='bg-gray-300 py-[0.1rem] px-[0.25rem] rounded-md'>계곡</button>  
          <button className='bg-gray-300 py-[0.1rem] px-[0.25rem] rounded-md'>반려견 동반 가능</button>  
        </div>
        <div>
          <div className='flex mt-[1rem]'>
            <div className='text-lg'>★★★★★ 5.0</div>
            <button className='bg-gray-300 px-[0.5rem] rounded-md ms-[0.25rem] md:ms-[0.5rem] text-xs my-[0.1rem]'>후기 보기</button>
          </div>
          <div className='text-xs'>(28개의 평가)</div>
        </div>
      </div>
    </div>
  )
}

export default Camping;