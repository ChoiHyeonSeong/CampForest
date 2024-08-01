import React from 'react'
import UserReviewCard from '@components/User/UserReviewCard'

type Props = {}

const UserReviewList = (props: Props) => {
  return (
    <div className={`w-full`}>
      {/* 거래후기 상단 */}
      <div className={`flex w-full flex-all-center py-[1.25rem]`}>
        {/* 받은 후기 */}
        <div 
          className={`
            flex flex-col w-1/2 
            text-center
          `}
        >
          <div 
            className={`
              w-full 
              font-medium
            `}
          >
            20
          </div>
          <div className={`w-full`}>
            받은 후기 수
          </div>
        </div>

        {/* 받은 평점 */}
        <div 
          className={`
            flex flex-col w-1/2 
            text-center
          `}
        >
          <div 
            className={`
              w-full 
              font-medium
            `}
          >
            4.0
          </div>
          <div className={`w-full`}>
            받은 평점
          </div>
        </div>
      </div>

      {/* 후기 카드 */}
      <div className={`w-full px-[0.75rem]`}>
        {/* 거래 후기 개수에 따라 map 함수 실행할 곳 */}
        <UserReviewCard />
        <UserReviewCard />
        <UserReviewCard />
        <UserReviewCard />
        <UserReviewCard />
      </div>
    </div>
  )
}

export default UserReviewList