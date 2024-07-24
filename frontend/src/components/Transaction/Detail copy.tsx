import React from 'react'
import { ReactComponent as HeartOutline } from '@assets/icons/heart-outline.svg'

import FireGif from '@assets/images/fire.gif'

function Detail () {

  return (
    <div className='md:mt-[1.5rem] md:mx-auto md:w-[50rem]'>
      {/* 이미지 */}
      <div className='flex justify-center'>
        <div className='size-[25rem] bg-blue-300'></div>
      </div>
      {/* 내용 */}
      <div className='border-b'>
        <div className='flex text-sm mt-4 text-[#555555]'>
          <div className='me-6'>캠핑 장비 {'>'} 텐트</div>
          <div className='text-[#FF7F50] font-bold'>대여</div>
          <div className='ms-auto'>게시물 신고하기</div>
        </div>
        <div className='text-lg font-bold'>텐트 대여합니다.</div>
        <div className='flex text-lg font-bold'>
          <div>15,000</div>
          <div className='me-4'>원/일</div>
          <div>보증금 </div>
          <div className='ms-1'>0</div>
          <div>원</div>
        </div>
        <div className='flex items-center text-sm text-[#555555]'>
          <div>구미시 인동동</div>
          <div className='mx-2 text-xs'>|</div>
          <div>50분 전</div>
        </div>
        <div className='mt-4 mb-2 min-h-[8rem]'>
          <div>주니 텐트 4인용 대여합니다. 일당 15000원 보증금</div>
          <div>없습니다. 문의챗 주세요 @@@@@</div>
        </div>
        <div className='flex text-sm items-center mb-4'>
          <div>조회</div>
          <div className='ms-1 me-2'>1,200</div>
          <div>관심</div>
          <div className='ms-1 me-2'>3</div>
          <div className='flex ms-auto'>
            <button className='bg-black text-white px-20 py-2 rounded-md me-4'>채팅하기</button>
            <HeartOutline className='size-10'/>
          </div>
        </div>
      </div>
      {/* 사용자 정보 */}
      <div className='p-8'>
        <div className='flex mb-4'>
          <div className='w-2/5'>
            <div className='text-sm'>판매자 정보</div>
            <div className='flex m-2 items-center'>
              <div className='rounded-full size-10 bg-blue-300'></div>
              <div className='ms-4'>
                <div>사용자 아이디</div>
                <div className='text-[#999999]'>닉네임</div>
              </div>
            </div>
          </div>
          <div className='w-3/5'>
            <div>거래 불꽃 온도</div>
            <div>1273°C</div>
            <div className="w-full h-4 bg-gray-200 rounded-full mt-2">
              <div className="h-full rounded-full w-1/2 bg-gradient-to-r from-red-500 to-orange-400 relative">
                <img src={FireGif} alt="불꽃" className="absolute -right-16 -top-[3.5rem] size-32"/>
              </div>
            </div>
          </div>
        </div>
        <div className='flex md:flex-row flex-col'>
          <div className='flex md:w-2/5 md:justify-between md:pe-20 text-center'>
            <div className='md:w-fit w-1/2'>
              <div>20</div>
              <div>받은 후기 수</div>
            </div>
            <div className='md:w-fit w-1/2'>
              <div>4.0</div>
              <div>평균 평점</div>
            </div>
          </div>
          <div className='grid grid-cols-3 gap-4 md:w-3/5 md:mt-0 mt-8'>
            <div className='bg-blue-300 h-40'></div>
            <div className='bg-blue-300 h-40'></div>
            <div className='bg-blue-300 h-40'></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Detail;