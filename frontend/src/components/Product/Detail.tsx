import React from 'react';
import FireGif from '@assets/images/fire.gif';
import MoreOptionsMenu from '@components/MoreOptionsMenu'

function Detail() {
  return (
    <div className="flex justify-center">
      <div className="p-6 w-full lg:w-[60rem] xl:w-[66rem] lg:p-0 lg:pt-6 bg-teal-300">
        {/* 상단 */}
        <div className="flex md:flex-row flex-col w-full mb-[2rem] bg-white">
          {/* 이미지 */}
          <div className="rounded-lg overflow-hidden w-full md:w-2/5 aspect-1 flex-shrink-0 ">
            <div className='bg-pink-300 rounded-lg w-full aspect-1'>상품이미지</div>
          </div>
          {/* 내용 */}
          <div className="md:ps-6 w-full md:w-3/5">
            <div className="flex justify-between text-sm mt-[1rem] mb-[0.5rem] text-[#555555]">
              <div className='flex'>
                <div className="me-6">캠핑 장비 {'>'} 텐트</div>
                <div className="text-[#FF7F50] font-semibold">대여</div>
              </div>
              <MoreOptionsMenu />
            </div>
            <div className="text-2xl font-medium">텐트 대여합니다.</div>
            <div className="mt-[1.5rem] text-sm border-b border-[#EEEEEE] relative">
              <div className='w-full break-all'>
                bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
              </div>
              <div className="flex my-6">
                <div>조회</div>
                <div className="ms-1 me-2">1,200</div>
                <div>관심</div>
                <div className="ms-1 me-2">3</div>
              </div>
            </div>
            <div className="flex justify-between pt-6">
              <div>
                <div className="text-[#555555] font-medium">픽업 | 반납 장소</div>
                <div className="p-2 text-sm ">
                  <div>경상북도 구미시 옥계북로 6-23</div>
                  <div>경상북도 구미시 진평동 12번지</div>
                </div>
              </div>
              {/* 가격 */}
              <div className='mt-4'>
                <div className='flex justify-between text-lg md:text-xl mb-2'>
                  <div className='me-5 font-semibold'>가격</div>
                  <div className='font-bold'>15,000 원/일</div>
                </div>
                <div className='flex justify-between text-base text-gray-500 md:text-lg'>
                  <div className='me-5 font-semibold 0'>보증금</div>
                  <div className='font-bold'>10,000 원</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex md:flex-row flex-col justify-between rounded-sm bg-slate-400">
          {/* 판매자 정보 */}
          <div className='bg-fuchsia-400 w-[calc(100% - 24.5rem)]'>
            <div className='mb-3'><span className='font-semibold'>사용자1</span>의 제품</div>
            <div className='flex'>
              <div className='rounded-full bg-black size-12 me-4'></div>
              <div className='flex flex-col'>
                <div className='flex'>
                  <div>거래 불꽃 온도</div>
                  <div className='ms-auto text-[#FF0000]'>1273°C</div>
                </div>
                <div className="w-full h-4 bg-gray-200 rounded-full mt-2">
                <div className="h-full rounded-full w-1/2 bg-gradient-to-r from-red-500 to-orange-4 relative">
                  <img
                    src={FireGif}
                    alt="불꽃"
                    className="absolute -right-16 -top-[3.5rem] size-32"
                  />
                </div>
              </div>
              </div>
             
            </div>
          </div>

          {/*  */}
          <div className='flex justify-end md:justify-normal items-center'>
            <button className='w-48 h-10 py-2 rounded-md border-2 border-[#FF7F50] text-[#FF7F50] font-semibold bg-white me-2 flex flex-all-center'>찜하기</button>
            <button className='w-48 h-10 py-2 rounded-md bg-[#FF7F50] text-white flex flex-all-center'>채팅하기</button>
          </div>


          {/* <div className="flex mb-4 w-[25rem] bg-[#FAFAFA] shadow-sm px-[1rem] py-[1rem] me-[5.5rem]">
            <div className="w-1/3">
              <div className="text-sm">판매자 정보</div>
              <div className="flex m-2 items-center">
                <div className="">
                  <div>사용자 아이디</div>
                  <div className="text-[#999999]">닉네임</div>
                </div>
              </div>
            </div>
            <div className="w-2/3 py-[0.5rem]">
              <div className='flex'>
                <div>거래 불꽃 온도</div>
                <div className='ms-auto text-[#FF0000]'>1273°C</div>
              </div>
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
          </div> */}
          {/* 찜 및 채팅 버튼 */}
        </div>
        <div>
          <div>하치와레미콘님의 거래 상품</div>
          <div className='grid grid-cols-5 p-[1rem] gap-[1rem] justify-center'>
            <div className='border rounded-lg'>
              <div className='bg-red-100 w-full aspect-1 rounded-lg'></div>
              <div className='p-[0.5rem]'>
                <div>뭔가 감성있는 텐트</div>
                <div className='text-[#FF7F50] text-sm'>대여</div>
                <div className='text-end'>12,800 원/일</div>
              </div>
            </div>
            <div className='border rounded-lg'>
              <div className='bg-red-100 w-full aspect-1 rounded-lg'></div>
              <div className='p-[0.5rem]'>
                <div>뭔가 감성있는 텐트</div>
                <div className='text-[#FF7F50] text-sm'>대여</div>
                <div className='text-end'>12,800 원/일</div>
              </div>
            </div>
            <div className='border rounded-lg'>
              <div className='bg-red-100 w-full aspect-1 rounded-lg'></div>
              <div className='p-[0.5rem]'>
                <div>뭔가 감성있는 텐트</div>
                <div className='text-[#FF7F50] text-sm'>대여</div>
                <div className='text-end'>12,800 원/일</div>
              </div>
            </div>
            <div className='border rounded-lg'>
              <div className='bg-red-100 w-full aspect-1 rounded-lg'></div>
              <div className='p-[0.5rem]'>
                <div>뭔가 감성있는 텐트</div>
                <div className='text-[#FF7F50] text-sm'>대여</div>
                <div className='text-end'>12,800 원/일</div>
              </div>
            </div>
            <div className='border rounded-lg'>
              <div className='bg-red-100 w-full aspect-1 rounded-lg'></div>
              <div className='p-[0.5rem]'>
                <div>뭔가 감성있는 텐트</div>
                <div className='text-[#FF7F50] text-sm'>대여</div>
                <div className='text-end'>12,800 원/일</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>    
  );
}

export default Detail;
