import React from 'react'
import { ReactComponent as StarIcon } from '@assets/icons/star.svg'

type Props = {}

const UserReviewCard = (props: Props) => {
  return (
    <div className='bg-orange-50 rounded py-5 px-4 mb-3'>
      {/* 평점 */}
      <div className='flex items-center mb-2'>
        <StarIcon className='size-5 me-2'/>
        <div className='font-medium text-lg'>4.0</div>
      </div>

      {/* 후기 텍스트 */}
      <div className='w-full text-justify break-all text-base'>
        거래약속을 너무 잘 지켰어요!! 또 거래하고 싶습니다! 짱짱맨! 야호 야호야호 무야호이안시성장판소리안
      </div>
    </div>
  )
}

export default UserReviewCard