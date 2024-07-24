import React from 'react';
import { ReactComponent as HeartOutline } from '@assets/icons/heart-outline.svg';

import FireGif from '@assets/images/fire.gif';

function Detail() {
  return (
    <div className="md:mt-[1.5rem] md:mx-auto md:w-[70rem]">
      <div className="flex h-[25rem] mb-[4rem]">
        {/* 이미지 */}
        <div className="flex justify-center">
          <div className="size-[25rem] bg-blue-300 rounded-lg"></div>
        </div>
        {/* 내용 */}
        <div className="px-[2.5rem] w-full">
          <div className="flex text-sm mt-[1rem] mb-[0.5rem] text-[#555555]">
            <div className="me-6">캠핑 장비 {'>'} 텐트</div>
            <div className="text-[#FF7F50] font-bold">대여</div>
            <div className="ms-auto">게시물 신고하기</div>
          </div>
          <div className="text-2xl font-bold">텐트 대여합니다.</div>
          {/* <div className='flex items-center text-[0.75rem] text-[#555555]'>
            <div>구미시 인동동</div>
            <div className='mx-2 text-xs'>|</div>
            <div>50분 전</div>
          </div> */}
          <div className="mt-[1.5rem] mb-[2rem] min-h-[11rem] text-sm border-b border-[#EEEEEE] relative">
            <div>주니 텐트 4인용 대여합니다. 일당 15000원 보증금</div>
            <div>없습니다. 문의챗 주세요 @@@@@</div>

            <div className="flex absolute bottom-[1.5rem]">
              <div>조회</div>
              <div className="ms-1 me-2">1,200</div>
              <div>관심</div>
              <div className="ms-1 me-2">3</div>
            </div>
          </div>
          <div className="h-[7rem] grid grid-cols-2">
            <div>
              <div className="text-[#555555]">픽업 | 반납 장소</div>
              <div className="ms-[1rem] text-sm">
                <div>경상북도 구미시 옥계북로 6-23</div>
                <div>경상북도 구미시 진평동 12번지</div>
              </div>
            </div>
            {/* 가격 */}
            <div>
              <div className="flex justify-end text-2xl font-bold mb-[0.25rem]">
                <div>가격</div>
                <div className="flex min-w-[12rem] justify-end">
                  <div>15,000</div>
                  <div className="ms-[0.5rem]">원/일</div>
                </div>
              </div>
              <div className="flex justify-end text-xl font-bold text-[#333333]">
                <div>보증금</div>
                <div className="flex min-w-[12rem] justify-end">
                  <div>15,000</div>
                  <div className="ms-[0.5rem]">원</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-sm mb-[2rem] flex rounded-lg px-[2rem] pt-[2rem] pb-[1rem] bg-[#FAFAFA] shadow-sm">
        <div className="flex mb-4 w-[25rem]">
          <div className="w-2/5">
            <div className="text-sm">판매자 정보</div>
            <div className="flex m-2 items-center">
              <div className="rounded-full size-10 bg-blue-300"></div>
              <div className="ms-4">
                <div>사용자 아이디</div>
                <div className="text-[#999999]">닉네임</div>
              </div>
            </div>
          </div>
          <div className="w-3/5">
            <div>거래 불꽃 온도</div>
            <div>1273°C</div>
            <div className="w-full h-4 bg-gray-200 rounded-full mt-2">
              <div className="h-full rounded-full w-1/2 bg-gradient-to-r from-red-500 to-orange-400 relative">
                <img
                  src={FireGif}
                  alt="불꽃"
                  className="absolute -right-16 -top-[3.5rem] size-32"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end w-[40rem] relative">
        <button className="absolute bottom-[1rem] right-[18rem] border border-[#FF7F50] text-[#FF7F50] font-bold bg-white hover:bg-[#FF7F50] hover:text-white hover:font-medium px-28 py-2 rounded-md ms-4 transition-colors">
            찜하기
          </button>
          <button className="absolute bottom-[1rem] bg-[#FF7F50] hover:bg-[#FF7700] text-white px-28 py-2 rounded-md ms-4 transition-colors">
            채팅하기
          </button>
        </div>
      </div>
      <div>
        <div>하치와레미콘님의 거래 상품</div>
        <div className='flex p-[1rem] space-x-[1rem] justify-center'>
          <div className='border rounded-lg'>
            <div className='bg-red-100 size-[12rem] rounded-lg'></div>
            <div className='p-[0.5rem]'>
              <div>뭔가 감성있는 텐트</div>
              <div className='text-[#FF7F50] text-sm'>대여</div>
              <div className='text-end'>12,800 원/일</div>
            </div>
          </div>
          <div className='border rounded-lg'>
            <div className='bg-red-100 size-[12rem] rounded-lg'></div>
            <div className='p-[0.5rem]'>
              <div>뭔가 감성있는 텐트</div>
              <div className='text-[#FF7F50] text-sm'>대여</div>
              <div className='text-end'>12,800 원/일</div>
            </div>
          </div>
          <div className='border rounded-lg'>
            <div className='bg-red-100 size-[12rem] rounded-lg'></div>
            <div className='p-[0.5rem]'>
              <div>뭔가 감성있는 텐트</div>
              <div className='text-[#FF7F50] text-sm'>대여</div>
              <div className='text-end'>12,800 원/일</div>
            </div>
          </div>
          <div className='border rounded-lg'>
            <div className='bg-red-100 size-[12rem] rounded-lg'></div>
            <div className='p-[0.5rem]'>
              <div>뭔가 감성있는 텐트</div>
              <div className='text-[#FF7F50] text-sm'>대여</div>
              <div className='text-end'>12,800 원/일</div>
            </div>
          </div>
          <div className='border rounded-lg'>
            <div className='bg-red-100 size-[12rem] rounded-lg'></div>
            <div className='p-[0.5rem]'>
              <div>뭔가 감성있는 텐트</div>
              <div className='text-[#FF7F50] text-sm'>대여</div>
              <div className='text-end'>12,800 원/일</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
