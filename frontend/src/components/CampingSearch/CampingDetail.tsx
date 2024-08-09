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
        className={`
          ${props.isModalOpen ? 'block bg-light-black bg-opacity-80 inset-0' : 'hidden'}
          fixed z-[20] 
        `}
        onClick={props.modalClose}
      >
      </div>
      <div
        className={`
          ${props.isModalOpen ? 'translate-y-0 lg:translate-x-0' : 'translate-y-full lg:translate-x-full'}
          ${props.isModalBlocked ? 'block' : 'hidden'}
          fixed lg:top-0 bottom-0 lg:right-0 z-[30] w-full lg:w-[60rem] h-[80vh] lg:h-full md:px-[10%] md:py-[5%] lg:p-[5rem]
          bg-light-white
          dark:bg-dark-white
          overflow-y-auto scrollbar-hide transform transition-transform duration-300 ease-in-out lg:translate-y-0
        `}
        onTransitionEnd={props.handleTransitionEnd}
      >
        <div 
          className={`
            w-full mb-[1rem]
            bg-light-gray
            dark:bg-dark-gray
            aspect-[1.8]`} 
        />
        <div className={`max-md:p-[1rem]`}>
          <div 
            className={`
              my-[0.75rem]
              text-3xl
            `}
          >
            힐링피아 카라반 글램핑 풀 캠핑장
          </div>
          <div 
            className={`
              mb-[0.5rem]
              text-xl
            `}
          >
            경기 가평군 설악면 유명산길 61-75
          </div>
          <div className={`flex mb-[0.75rem]`}>
            <div>
              별점 ----------------
            </div>
          </div>
          <div className={`mb-[5rem] space-y-[1rem]`}>
            <div className={`flex`}>
              <div className={`w-[5rem]`}>
                타입
              </div>
              <div>
                일반야영장
              </div>
            </div>
            <div className={`flex`}>
              <div className={`w-[5rem]`}>
                태그
              </div>
              <div className={`flex space-x-[0.5rem]`}>
                <div 
                  className={`
                    px-[0.25rem] 
                    text-sm rounded-md
                  `}
                >
                  계곡
                </div>
                <div 
                  className={`
                    px-[0.25rem]
                    text-sm rounded-md
                  `}
                >
                  반려견 동반 가능
                </div>
                <div 
                  className={`
                    px-[0.25rem]
                    text-sm rounded-md
                  `}
                >
                  전기
                </div>
                <div 
                  className={`
                    px-[0.25rem]
                    text-sm rounded-md
                  `}
                >
                  마트
                </div>
              </div>
            </div>
            <div className={`flex`}>
              <div className={`w-[5rem]`}>
                정보
              </div>
              <div className={`w-[calc(100%-5rem)]`}>
                이 편지는 영국에서 시작되어 ..이 편지는 영국에서 시작되어 ..이 편지는 영국에서
                시작되어 ..이 편지는 영국에서 시작되어 ..이 편지는 영국에서 시작되어 ..이 편지는
                영국에서 시작되어 ..이 편지는 영국에서 시작되어 ..
              </div>
            </div>
            <div className={`flex`}>
              <div className={`w-[5rem]`}>
                문의전화
              </div>
              <div>
                033-345-1234
              </div>
            </div>
          </div>
          <div className={`container`}>
            <div className={`flex justify-end items-center space-x-[0.75rem]`}>
              <div>
                날씨
              </div>
              <button 
                className={`
                  px-[1rem] py-[0.5rem]
                  rounded-md
                `}
              >
                홈페이지
              </button>
              <button 
                className={`
                  px-[1rem] py-[0.5rem]
                  rounded-md
                `}
              >
                예약하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampingDetail