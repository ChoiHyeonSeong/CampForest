import React from 'react'
import { ReactComponent as HeartOutlineIcon } from '@assets/icons/Heart-outline-fill.svg'
import { ReactComponent as FillHeartIcon } from '@assets/icons/heart-fill.svg'


const BoardComment = () => {
  return (
    <div className='bg-white w-full border-b border-[#ccc] min-h-[5rem] px-2 py-3 flex justify-between items-center'>
      <div className='flex'>
        {/* 프로필 이미지 */}
        <div className='bg-orange-400 rounded-full size-10 md:size-12 me-2 shrink-0'>
          {/* 사용자 프로필 이미지 받아와서 넣을 곳 ! */}
          <img src='' alt='NOIMG'></img>
        </div>

        {/* 닉네임 및 글 */}
        <div className=''>
          <div className='flex mb-1'>
            <div className='text-sm md:text-base me-2 font-medium'>사용자닉네임</div>
            <div className='text-xs md:text-sm text-gray-500 '>26분전</div>
          </div>

          <div className='text-base break-all text-gray-600'>
            댓글을 달아주세요.
          </div>
        
        </div>
      </div>
      {/* 좋아요 */}
      <div className='ms-4'>
        <HeartOutlineIcon className='size-[1.4rem] md:size-6 cursor-pointer fill' />
      </div>
    </div>
  )
}

export default BoardComment