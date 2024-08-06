import React, { useState, useEffect } from 'react'
import UserReviewList from '@components/User/UserReviewList';

type Props = {}

const UReview = (props: Props) => {
  return (
    <div>
      {/* {reveiw?.content.map((reveiw: any) => ( */}
        <UserReviewList />
      {/* ))} */}
    </div>
  )
}

export default UReview