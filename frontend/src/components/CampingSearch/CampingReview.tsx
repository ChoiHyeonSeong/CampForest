import React from 'react'
import { ReactComponent as StarIcon } from '@assets/icons/star.svg'

type Props = {}

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
        <div className='size-[2.8rem] me-[0.5rem] rounded-full bg-black overflow-hidden'>
          <img
            src=""
            alt=""
            className='size-full '  
          />
        </div>
        
        <div className='flex flex-col'>
          <div className='flex items-baseline'>
            <p className='font-medium cursor-pointer'>닉네임꺽정수리</p>
            <p className='text-xs ms-[0.5rem]'>1달전</p>
          </div>

          {/* 별점 */}
          <div className='flex mt-[0.15rem]'>
            <StarIcon className='size-[1rem] fill-light-star' />
            <StarIcon className='size-[1rem] fill-light-star' />
            <StarIcon className='size-[1rem] fill-light-star' />
            <StarIcon className='size-[1rem] fill-light-star' />
            <StarIcon className='size-[1rem] fill-light-gray-1' />
          </div>
        </div>
        


      </div>

      {/* 후기 */}
      <div className='mt-[0.75rem] px-[0.25rem] text-justify break-all'>
      자연 속 평온함이 가득한 넓고 깨끗한 캠핑장, 편리한 시설과 아름다운 경관으로 가족 여행에 최적입니다.
      자연 속 평온함이 가득한 넓고 깨끗한 캠핑장, 편리한 시설과 아름다운 경관으로 가족 여행에 최적입니다.
      자연 속 평온함이 가득한 넓고 깨끗한 캠핑장, 편리한 시설과 아름다운 경관으로 가족 여행에 최적입니다.
      </div>
    </div>
  )
}

export default CampingReview