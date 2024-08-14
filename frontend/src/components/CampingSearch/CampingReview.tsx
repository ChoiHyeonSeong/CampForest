import React from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as StarIcon } from '@assets/icons/star.svg'
import { Review } from './CampingReviewList'
import defaultImage from '@assets/images/basic_profile.png';

type Props = {
  review: Review;
  deleteFunction: (reviewId: number) => void;
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
      <div className='flex justify-between items-start'>
        {/* 이미지 */}
        <div className='flex'>
          <div className='size-[2.6rem] me-[0.5rem] rounded-full overflow-hidden'>
          <img src={props.review.profileImage ? props.review.profileImage : defaultImage} alt={props.review.nickname} className='size-full object-cover' />
          </div>
          
          <div className='flex flex-col'>
            <div className='flex items-baseline justify-between'>
              <Link 
                to={`/user/${props.review.userId}`}
                className='font-medium cursor-pointer hover:underline'
              >
                {props.review.nickname}
              </Link>
            </div>

            {/* 별점 */}
            <div className='flex mt-[0.15rem]'>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`size-[1rem] ${star <= props.review.rate ? 'fill-light-star' : 'fill-light-gray-1'}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => props.deleteFunction(props.review.reviewId)}
          className='text-sm'
        >
          삭제
        </button>
      </div>

      {/* 후기 */}
      <div className='mt-[0.75rem] px-[0.25rem] text-justify break-all'>
        {props.review.content}
        <p className='mt-[0.5rem] text-[0.6rem]'>{props.review.createdAt}</p>
      </div>
      
    </div>
  )
}

export default CampingReview