import React from 'react'
import ProductList from '@components/Transaction/ProductList';

// icon
import { ReactComponent as FilterIcon } from '@assets/icons/filter.svg';
import { ReactComponent as CircleIcon } from '@assets/icons/circle.svg';

function Trade() {
  return (
    <div className='flex justify-center items-center'>
      <div className='bg-slate-200 p-6 w-full lg:w-[48rem] xl:w-[55rem] lg:p-0'>

        {/* 페이지명 - 모바일에서는 네브바에 표시됨 */}
        <div className='my-6'>
          <h3 className='hidden md:block font-medium md:text-lg lg:text-xl xl:text-2xl'>상품 판매/대여</h3>
        </div>

        {/* 카테고리별 정렬 */}
        <div className='my-6 flex justify-between items-center'>
          <div className='flex justify-between gap-2'>
            <div className='py-1 px-3 border-2 border-[#555] rounded-full text-[#555] flex items-center'>
              <p>카테고리</p>
              <FilterIcon />
            </div>
            <div className='py px-3 border-2 border-[#555] rounded-full text-[#555] flex items-center'>
              <p>가격</p>
              <FilterIcon />
            </div>
            <div className='py-1 px-3 border-2 border-[#555] rounded-full text-[#555] flex items-center'>
              <p>지역</p>
              <FilterIcon />
            </div>
            <div className='py-1 px-3 border-2 border-[#555] rounded-full text-[#555] flex items-center'>
              <p>기간</p>
              <FilterIcon />
            </div>
          </div>

          <div className='flex items-center'>
            <CircleIcon className='size-5'/>
            <p className='ms-2'>거래가능상품만 보기</p>
          </div>
        </div>

        {/* 거래상품 목록 */}
        <ProductList />
          

      </div>
    </div>
  )
}

export default Trade