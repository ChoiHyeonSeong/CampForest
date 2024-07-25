import React from 'react'

type Props = {
  isModalOpen: boolean;
  isModalBlocked: boolean;
  modalClose: () => void;
  handleTransitionEnd: () => void;
}

const CampingDetail = (props: Props) => {
  return (
    <div>
      <div
        className={`fixed z-20 bg-opacity-70 ${props.isModalOpen ? 'bg-black inset-0 block' : 'bg-none hidden'}`}
        onClick={props.modalClose}
      >
      </div>
      <div
        className={`fixed z-30 md:px-[10%] md:py-[5%] lg:p-[5rem]
          overflow-y-auto scrollbar-hide
          w-full h-[80vh] bottom-0 md:w-full md:h-[50vh] 
          lg:right-0 lg:top-0 lg:h-full lg:w-[60rem] bg-[#EEEEEE] transform transition-transform duration-300 ease-in-out lg:translate-y-0 
          ${props.isModalOpen ? 'translate-y-0 lg:translate-x-0' : 'translate-y-full lg:translate-x-full'}
          ${props.isModalBlocked ? 'block' : 'hidden'}
          `}
        onTransitionEnd={props.handleTransitionEnd}
      >
        <div className="bg-gray-400 w-full aspect-[1.8] mb-[1rem]"></div>
        <div className='max-md:p-[1rem]'>
          <div className="text-3xl my-[0.75rem]">힐링피아 카라반 글램핑 풀 캠핑장</div>
          <div className="text-xl mb-[0.5rem]">경기 가평군 설악면 유명산길 61-75</div>
          <div className="flex mb-[0.75rem]">
            <div>별점 ----------------</div>
          </div>
          <div className="space-y-[1rem] mb-[5rem]">
            <div className="flex">
              <div className="w-[5rem]">타입</div>
              <div>일반야영장</div>
            </div>
            <div className="flex">
              <div className="w-[5rem]">태그</div>
              <div className="flex space-x-[0.5rem]">
                <div className="bg-[#CCCCCC] px-[0.25rem] rounded-md text-sm">계곡</div>
                <div className="bg-[#CCCCCC] px-[0.25rem] rounded-md text-sm">
                  반려견 동반 가능
                </div>
                <div className="bg-[#CCCCCC] px-[0.25rem] rounded-md text-sm">전기</div>
                <div className="bg-[#CCCCCC] px-[0.25rem] rounded-md text-sm">마트</div>
              </div>
            </div>
            <div className="flex">
              <div className="w-[5rem]">정보</div>
              <div className="w-[calc(100%-5rem)]">
                이 편지는 영국에서 시작되어 ..이 편지는 영국에서 시작되어 ..이 편지는 영국에서
                시작되어 ..이 편지는 영국에서 시작되어 ..이 편지는 영국에서 시작되어 ..이 편지는
                영국에서 시작되어 ..이 편지는 영국에서 시작되어 ..
              </div>
            </div>
            <div className="flex">
              <div className="w-[5rem]">문의전화</div>
              <div>033-345-1234</div>
            </div>
          </div>
          <div className="container">
            <div className="flex justify-end space-x-[0.75rem] items-center">
              <div>날씨</div>
              <button className="bg-[#CCCCCC] px-[1rem] py-[0.5rem] rounded-md">홈페이지</button>
              <button className="bg-[#CCCCCC] px-[1rem] py-[0.5rem] rounded-md">예약하기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampingDetail