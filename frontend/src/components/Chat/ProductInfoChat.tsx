import React from 'react'

type Props = {}

const ProductInfoChat = ({ }: Props) => {
  return (
    <div 
      className='
        flex justify-between items-center w-full p-[0.8rem] 
        bg-light-white border-light-border
        dark:bg-dark-white dark-border-dark-border
        border-y'>
      {/* 상품정보 */}
      <div className='flex items-center'>
        {/* 상품이미지 */}
        <div className='size-[3.5rem] me-[0.75rem] bg-gray-300 overflow-hidden'>
          <img src='' alt='상품이미지'></img> {/* 이미지 들어갈 곳 */}
        </div>

        {/* 상품상세 */}
        <div>
          {/* 상품 이름 */}
          <div className='text-[1.1rem] font-semibold'>니모 텐트 20인용</div>

          {/* 상품 가격 */}
          <div className='flex mt-[0.2rem] text-light-text-secondary dark:text-dark-text-secondary text-[0.97rem] font-medium'>
            <div>보증금 0원</div>
            <div className='ms-[0.5rem]'>15,000원/일</div>
          </div>
        </div>
      </div>
 
      {/* 거래 상태표시 0*/}
      <div className='px-[0.7rem] py-[0.4rem] bg-light-gray-1 text-white rounded'>대여중</div>

    </div>
  )
}

export default ProductInfoChat