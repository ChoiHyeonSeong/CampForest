import React from 'react'

// icon
import { ReactComponent as StarIcon } from '@assets/icons/star.svg'

const Review = () => {
  return (
    <div 
      className={`
        min-w-[22rem] md:max-w-[40rem] mx-auto md:my-[2rem] max-md:px-[1.5rem] py-[2rem]
        rounded-md 
      `}
    >
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
    <div 
      className={`
        flex justify-between items-center w-full mb-[1rem] px-[0.75rem] py-[1rem] 
        rounded-sm
      `}
    >
      <div className={`flex me-[2.5rem]`}>
        {/* 별점 */}
        <div className={`flex items-center me-[0.75rem]`}>
          <StarIcon className={`size-[1.25rem] me-[0.25rem]`} />
          <span>
            4.0
          </span>
        </div>
        {/* 후기 */}
        <div className={`flex items-center`}>
          사용자가 작성한 거래후기가 들어갈 예정입니다. 많은 관심부탁드립니다.
        </div>
      </div>     
      {/* 상품사진 -> 본인프로필에만 보일 예정! */}
      <div className={`flex shrink-0 size-[3rem]`} />
    </div>
  )
}

export default Review