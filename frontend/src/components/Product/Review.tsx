import React from 'react'

// icon
import { ReactComponent as StarIcon } from '@assets/icons/star.svg'

const Review = () => {
  return (
    <div className='mx-auto min-w-[22rem] md:max-w-[40rem] md:my-[2rem] rounded-md px-[1.5rem] md:px-0 py-[2rem] md:pt-[2rem]'>
      <div>
        {/* 리뷰개수에 따라 반복문 사용할 것 같아, 코드직관성을 위해 아래 리뷰카드 컴포넌트 제작 */}
        <ReviewCard />
        {/* <ReviewCard /> */}
        {/* <ReviewCard /> */}
        {/* <ReviewCard /> */}
      </div>

    </div>
  )
}

const ReviewCard = () => {
  return (
    <div className='flex justify-between items-center w-full bg-gray-200 rounded-sm px-3 py-4 mb-4'>
      <div className='flex me-10'>
        {/* 별점 */}
        <div className='flex items-center me-3'>
          <StarIcon className='size-5 me-1' />
          <span>4.0</span>
        </div>

        {/* 후기 */}
        <div className='flex items-center'>
          사용자가 작성한 거래후기가 들어갈 예정입니다. 많은 관심부탁드립니다.
        </div>
      </div>     

      {/* 상품사진 -> 본인프로필에만 보일 예정! */}
      <div className='size-12 bg-slate-600 flex shrink-0'>
      </div>
    </div>

  )
}

export default Review