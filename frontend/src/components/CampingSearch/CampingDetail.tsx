import React, { useEffect, useRef } from 'react'
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg'

import CampingReviewList from '@components/CampingSearch/CampingReviewList'
type Props = {
  isModalOpen: boolean;
  isModalBlocked: boolean;
  modalClose: () => void;
  handleTransitionEnd: () => void;
}

const CampingDetail = (props: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.isModalOpen && modalRef.current) {
      modalRef.current.scrollTop = 0;
    }
  }, [props.isModalOpen]);


  return (
    <div>

      {/* 모달 */}
      <div
        ref={modalRef}
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
          fixed lg:top-0 bottom-0 lg:right-0 z-[30] w-full lg:w-[50rem] h-[80vh] lg:h-full sm:p-[3rem] lg:p-[4rem]
          bg-light-white
          dark:bg-dark-white
          overflow-y-auto transform transition-transform duration-300 ease-in-out lg:translate-y-0
        `}
        onTransitionEnd={props.handleTransitionEnd}
      >
        {/* 닫기 */}
        <CloseIcon
          onClick={props.modalClose}
          className='
            absolute top-[0.75rem] right-[0.75rem] size-[1.8rem]
            fill-light-border-icon
            dark:fill-dark-border-icon
            cursor-pointer
          '
        />

        {/* 전체 내용 */}
        <div className='flex flex-col'>

          {/* 이미지 */}
          <div 
            className={`
              w-full mb-[1rem]
              bg-light-gray
              dark:bg-dark-gray
              aspect-[3/2] overflow-hidden
            `} 
          >
            <img
              src=''
              alt='캠핑장 사진'
              className='size-full object-cover'
            />
          </div>

          {/* 캠핑장 디테일 */}
          <div className={`max-md:p-[1rem]`}>
            {/* 캠핑장 이름 */}
            <div 
              className={`
                my-[1rem]
                text-2xl font-semibold
              `}
            >
              힐링피아 카라반 글램핑 풀 캠핑장
            </div>

            {/* 캠핑장정보 */}
            <div className={`mb-[2rem] space-y-[1rem]`}>

              {/* 주소 */}
              <div className={`flex flex-col md:flex-row`}>
                <div className={`w-[5rem] font-semibold`}>
                  주소
                </div>
                <div className='mt-[0.25rem] ps-[0.25rem] md:ps-0'>
                  경기 가평군 설악면 유명산길 61-75
                </div>
              </div>



               <div className={`flex flex-col md:flex-row`}>
                <div className={`w-[5rem] font-semibold`}>
                  타입
                </div>
                <div className='mt-[0.25rem] ps-[0.25rem] md:ps-0'>
                  일반야영장
                </div>
              </div>

              {/* 캠핑장 태그 */}
              <div className={`flex flex-col md:flex-row`}>
                <div className={`w-[5rem] font-semibold`}>
                  태그
                </div>
                <div className={`flex space-x-[0.5rem] mt-[0.25rem] ps-[0.25rem] md:ps-0`}>
                  <div 
                    className={`
                      px-[0.25rem] py-[0.1rem]
                      bg-light-bgbasic
                      dark:bg-dark-bgbasic dark:text-dark-text-secondary
                      text-sm rounded font-medium
                    `}
                  >
                    계곡
                  </div>
                  <div 
                    className={`
                      px-[0.25rem] py-[0.1rem]
                      bg-light-bgbasic
                      dark:bg-dark-bgbasic dark:text-dark-text-secondary
                      text-sm rounded font-medium
                    `}
                  >
                    반려견가능
                  </div>
                  <div 
                    className={`
                      px-[0.25rem] py-[0.1rem]
                      bg-light-bgbasic
                      dark:bg-dark-bgbasic dark:text-dark-text-secondary
                      text-sm rounded font-medium
                    `}
                  >
                    전기
                  </div>
                  <div 
                    className={`
                      px-[0.25rem] py-[0.1rem]
                      bg-light-bgbasic
                      dark:bg-dark-bgbasic dark:text-dark-text-secondary
                      text-sm rounded font-medium
                    `}
                  >
                    마트
                  </div>
                </div>
              </div>

              {/* 캠핑장 정보 */}
              <div className={`flex flex-col md:flex-row`}>
                <div className={`w-[5rem] font-semibold`}>
                  정보
                </div>
                <div className={`w-full break-all text-justify`}>
                레저체험을 함께 즐길 수 있는 뇌운계곡 글램핑  뇌운계곡글램핑은 평창에 위치한 해발 600미터의 뇌운계곡에 있는 글램핑과 레저 체험을 함께 즐길 수 있는 캠핑장이다. 사이트는 총 7개인데, 4개는 글램핑 텐트, 3개는 몽골 텐트에 투명 돔 키친이 있다. 특히 몽골텐트는 천창이 투명하게 되어 있어 텐트 안에서도 하늘을 볼 수 있다. 텐트 내부의 집기들도 신경을 많이 써서 감성 캠핑을 즐기기 좋다. 또한 계곡에서의 래프팅, 패들 보드, 카약 강습은 물론 산악 오토바이, 숲속 서바이벌 게임 등 즐길 거리가 많다.
                </div>
              </div>

              {/* 캠핑장 전화 */}
              <div className={`flex flex-col md:flex-row`}>
                <div className={`w-[5rem] font-semibold`}>
                  문의전화
                </div>
                <div className='mt-[0.25rem] ps-[0.25rem] md:ps-0'>
                  033-345-1234
                </div>
              </div>

              {/* 캠핑장 타입 */}
              <div className={`flex flex-col md:flex-row`}>
                <div className={`w-[6rem] font-semibold`}>
                  개인 카라반
                </div>
                <div className='mt-[0.25rem] ps-[0.25rem] md:ps-0'>
                  Y
                </div>
              </div>

              {/* 개인 트레일러 동반여부 */}
              <div className={`flex flex-col md:flex-row`}>
                <div className={`w-[6rem] font-semibold`}>
                  개인 트레일러
                </div>
                <div className='mt-[0.25rem] ps-[0.25rem] md:ps-0'>
                  Y
                </div>
              </div> 
            </div>

            {/* 날씨 확인 */}
            <div className='mb-[1rem]'>
              <p className='font-semibold'>
                날씨
                <span>(최근 7일)</span>
                </p>
              <div className='bg-slate-200 w-full h-[8rem]'></div>
            </div>

            {/* 추가 링크 */}
            <div className='flex'>
              <button
                className='
                  max-md:w-1/2 me-[0.5rem] md:px-[1.5rem] py-[0.5rem]
                  bg-light-gray hover:bg-light-signature hover:text-light-white
                  dark:bg-dark-gray dark:hover:bg-dark-signature
                  transition duration-300
                '
              >
                홈페이지
              </button>
              <button
                className='
                  max-md:w-1/2 me-[0.5rem] md:px-[1.5rem] md:py-[0.5rem]
                  bg-light-gray hover:bg-light-signature hover:text-light-white
                  dark:bg-dark-gray dark:hover:bg-dark-signature
                  transition duration-300
                '
              >
                예약하기
              </button>
            </div>

            {/* 캠핑장 후기 */}
            <div className='my-[2rem]'>
              <CampingReviewList />
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default CampingDetail