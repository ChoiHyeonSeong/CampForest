import React from 'react'

// icon
import { ReactComponent as EyeIcon } from '@assets/icons/eyes.svg'
import { ReactComponent as FillHeartIcon } from '@assets/icons/heart-fill.svg'

const ProductList = () => {
  return (
    <div className='bg-pink-300 w-full flex flex-wrap'>
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
    </div>
  )
}

const ProductCard = () => {
  return (
    <div className='bg-white w-1/3 md:w-1/4 pe-3 pb-10'>
       {/* 상품사진 */}
       <div className='relative mb-3 w-full aspect-1'>
        <div className='bg-yellow-200 size-full'></div>
       </div>

       {/* 상품설명 */}
       <div className='w-full overflow-hidden text-[#333] ps-2'>
        <h5 className='font-semibold'>상품이름</h5>
        <p className='font-medium'>15,000원<span className='text-sm md:text-sm'>/일</span></p>
        <p className='font-light text-xs md:text-sm text-gray-500'>구미시 진평동</p>
        <div className='flex'>
          <div className='flex me-3 items-center'>
            <EyeIcon className='size-4 md:size-5 me-1' />
            <span>14</span>
          </div>
          <div className='flex items-center'>
            <FillHeartIcon className=' size-4 md:size-5 me-1' />
            <span>43</span>
          </div>
        </div>
       </div>
    </div>
  )
}

export default ProductList