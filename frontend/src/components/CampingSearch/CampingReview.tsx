import React from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as StarIcon } from '@assets/icons/star.svg'
import { Review } from './CampingReviewWrite'

type Props = {
  review: Review;
}

const CampingReview = (props: Props) => {
  return (
    <div
      className='
        flex flex-col w-full px-[0.75rem] py-[1rem]
        border-light-gray-1
        dark:border-dark-gray-1
        border-b
      '
    >
      {/* 사용자정보 */}
      <div className='flex'>
        {/* 이미지 */}
        <div className='size-[2.6rem] me-[0.5rem] rounded-full overflow-hidden'>
        <img src={props.review.profileImage} alt={props.review.author} className='size-full object-cover' />
        </div>
        
        <div className='flex flex-col'>
          <div className='flex items-baseline'>
            <Link 
              to={`/user/${props.review.userId}`}
              className='font-medium cursor-pointer hover:underline'
            >
              {props.review.author}
            </Link>
            <p className='text-xs ms-[0.5rem]'>{props.review.date}</p>
          </div>

          {/* 별점 */}
          <div className='flex mt-[0.15rem]'>
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`size-[1rem] ${star <= props.review.rating ? 'fill-light-star' : 'fill-light-gray-1'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 후기 */}
      <div className='mt-[0.75rem] px-[0.25rem] text-justify break-all'>
        {props.review.text}
      </div>
    </div>
  )
}

export default CampingReview