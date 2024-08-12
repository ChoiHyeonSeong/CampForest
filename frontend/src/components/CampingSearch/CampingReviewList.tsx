import React from 'react'
import CampingReview from './CampingReview'

type Props = {}

const CampingReviewList = (props: Props) => {
  return (
    <div className=''>
      <div className='flex font-semibold mb-[1rem] text-lg'>
        <p>후기</p>
        <span>(4)</span>
      </div>
      
      {/* 캠핑 후기 전체부모 */}
      <div
        className='
          p-[0.5rem]
          bg-light-bgbasic
          dark:bg-dark-bgbasic
        '
        >
          {/* 후기 */}
          <div>
            <CampingReview />
            <CampingReview />
            <CampingReview />
            <CampingReview />
          </div>

          {/* 후기 달기 */}
          <div>
            <textarea name="" id="" className='w-full h-[3rem] bg-transparent outline-none'></textarea>
            {/* <textarea
              type="text"
              placeholder='캠핑장 후기를 남겨보세요 (최대 150자 가능)'
              className='w-full h-[3rem] bg-transparent outline-none'
            /> */}
          </div>
      </div>
      
    </div>
  )
}

export default CampingReviewList