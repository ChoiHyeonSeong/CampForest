import React, { useState, useEffect } from 'react'
import UserReviewList from '@components/User/UserReviewList';

type Props = {
  userId: number
}

const UReview = (props: Props) => {
  return (
    <div>
      <UserReviewList userId={props.userId}/>
    </div>
  )
}

export default UReview