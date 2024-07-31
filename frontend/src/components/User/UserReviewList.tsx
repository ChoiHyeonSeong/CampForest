import React from 'react'
import UserReviewCard from '@components/User/UserReviewCard'

type Props = {}

const UserReviewList = (props: Props) => {
  return (
    <div className='w-full'>
      {/* 거래후기 상단 */}
      <div className='flex w-full flex-all-center py-5'>
        {/* 받은 후기 */}
        <div className='flex flex-col text-center w-1/2'>
          <div className='w-full'>20</div>
          <div className='w-full'>받은 후기 수</div>
        </div>

        {/* 받은 평점 */}
        <div className='flex flex-col text-center w-1/2'>
          <div className='w-full'>4.0</div>
          <div className='w-full'>받은 평점</div>
        </div>
      </div>

      {/* <UserReviewCard /> */}
    </div>
  )
}

export default UserReviewList