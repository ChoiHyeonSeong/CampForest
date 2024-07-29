import React from 'react'

import { ReactComponent as MoreDotIcon } from '@assets/icons/more-dots.svg'


const MoreOptionsMenu = () => {
  return (
    <div className='size-6 relative cursor-pointer'>
      <MoreDotIcon className='size-full absolute top-0 left-0' />
      <div className='font-medium text-left flex flex-col ps-1 pe-5 absolute z-10 top-6 right-4 w-28 rounded-sm border border-gray-400 bg-white'>
        <button className='py-2 hover:text-[#FF7F50]'>수정하기</button>
        <button className='py-2 hover:text-[#FF7F50]'>삭제하기</button>
      </div>
    </div>
  )
}

export default MoreOptionsMenu