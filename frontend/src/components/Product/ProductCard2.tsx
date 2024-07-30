import React, { useState } from 'react';

// icon
import { ReactComponent as EyeIcon } from '@assets/icons/eyes.svg'
import { ReactComponent as HeartOutlineIcon } from '@assets/icons/Heart-outline-fill.svg'
import { ReactComponent as FillHeartIcon } from '@assets/icons/heart-fill.svg'
import { ReactComponent as BlackHeartIcon } from '@assets/icons/heart-black.svg'

import ProfileImgEX from '@assets/images/productExample.png'

// 판매완료 보기용 임시 컴포넌트
const ProductCard2 = () => {

  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  return ( //md:w-[calc(100%-7rem)]
    <div className='cursor-pointer bg-white w-1/3 md:w-1/4 xl:w-1/5 pt-3 pb-6 px-3 rounded-md hover:shadow-md hover:scale-[1.01] transition-all duration-300'>
       {/* 상품사진 */}
       <div className='relative mb-3 w-full aspect-1 rounded-md overflow-hidden'>
        {/* 기본 이미지 - 상시 */}
        <div className='bg-yellow-200 size-full  absolute z-1'>
          <img src={ProfileImgEX} alt='ProductImg' className='size-full '/>
        </div>
        
        {/* 판매완료 - 완료상품에만 띄움(기본 hidden처리) */}
        <div className='absolute z-2 w-full h-full bg-[#00000099] flex justify-center items-center'>
          <div className='w-1/3 aspect-1 border-2 border-white rounded-full flex justify-center items-center'>
            <div className='text-white text-center'>판매<br/>완료</div>
          </div>
        </div>

        {/* 찜 - 상시 */}
        <div onClick={toggleLike} className='absolute z-3 top-1 right-1 cursor-pointer'>
          {isLiked ? (
            <FillHeartIcon className='size-4 md:size-5 fill-red-500'/>
          ) : (
            <HeartOutlineIcon className='size-4 md:size-5' />
          )}
        </div>
       </div>

       {/* 상품설명 */}
       <div className='w-full overflow-hidden text-[#333] ps-2'>
        <h5 className='font-semibold truncate overflow-hidden whitespace-nowrap'>상품이름상품이름상품이름상품이름상품이름</h5>
        <p className='font-medium'>15,000원<span className='text-sm md:text-sm'>/일</span></p>
        <p className='font-light text-xs md:text-sm text-gray-500 my-1'>구미시 진평동</p>
        <div className='flex'>
          <div className='flex me-3 items-center'>
            <EyeIcon className='size-3 md:size-4 me-1' />
            <span className='text-sm'>14</span>
          </div>
          <div className='flex items-center'>
            <BlackHeartIcon className=' size-3 md:size-4 me-1 fill-gray-700' />
            <span className='text-sm'>43</span>
          </div>
        </div>
       </div>
    </div>
  )
}

export default ProductCard2;