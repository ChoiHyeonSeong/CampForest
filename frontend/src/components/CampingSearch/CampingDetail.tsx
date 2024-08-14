import React, { useEffect, useRef, useState } from 'react'
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg'

import { CampingDataType } from './Camping'
import CampingReviewList from '@components/CampingSearch/CampingReviewList'
type Props = {
  isModalOpen: boolean;
  isModalBlocked: boolean;
  modalClose: () => void;
  handleTransitionEnd: () => void;
  selectedData: CampingDataType | null;
}

const CampingDetail = (props: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    if (props.isModalOpen && modalRef.current) {
      modalRef.current.scrollTop = 0;
    }
  }, [props.isModalOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isSwipeDown = distance < -50;
    if (isSwipeDown) {
      props.modalClose();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };


  const renderContent = () => {
    if (props.selectedData === null) {
      return (
        <div className='text-center text-lg'>
          데이터를 불러오고 있습니다...
        </div>
      );
    }

    let introduction: string;
    if (props.selectedData.intro) {
      introduction = props.selectedData.intro
    } else if (props.selectedData.featureNm) {
      introduction = props.selectedData.featureNm
    } else if (props.selectedData.lineIntro) {
      introduction = props.selectedData.lineIntro
    } else {
      introduction = '소개 정보 없음'
    }

    const tags = [
      ...(props.selectedData.lctCl ? props.selectedData.lctCl.split(',') : []),
      ...(props.selectedData.sbrsCl ? props.selectedData.sbrsCl.split(',') : []),
      ...(props.selectedData.posblFcltyCl ? props.selectedData.posblFcltyCl.split(',') : []),
    ].map(tag => tag.trim());

    // animalCmgCl에 따라 태그 추가
    if (props.selectedData.animalCmgCl === '가능') {
      tags.push('애견동반 가능');
    } else if (props.selectedData.animalCmgCl === '소형견') {
      tags.push('소형견동반 가능');
    } else {
      tags.push('애견동반 불가능');
    }

    return (
      <>
        {/* 이미지 */}
        <div 
          className={`w-full mb-[1rem] bg-light-gray dark:bg-dark-gray aspect-[3/2] overflow-hidden`}
        >
          {props.selectedData.firstImageUrl ? (
            <img src={props.selectedData.firstImageUrl} alt='캠핑장 사진' className='size-full object-cover' />
          ) : (
            <div className='w-full h-full flex items-center justify-center'>
              <span className='text-light-gray-3 dark:text-dark-gray-3'>이미지가 없습니다.</span>
            </div>
          )}
        </div>

        {/* 캠핑장 디테일 */}
        <div className={`max-md:p-[1rem]`}>
          {/* 캠핑장 이름 */}
          <div className={`my-[1rem] text-2xl font-semibold`}>
            {props.selectedData.facltNm || "캠핑장 이름"}
          </div>

          {/* 캠핑장정보 */}
          <div className={`mb-[2rem] space-y-[1rem]`}>

            {/* 주소 */}
            <div className={`flex flex-col md:flex-row`}>
              <div className={`w-[5rem] font-semibold`}>주소</div>
              <div className='mt-[0.25rem] ps-[0.25rem] md:ps-0'>{props.selectedData.addr || "주소 정보 없음"}</div>
            </div>

            <div className={`flex flex-col md:flex-row`}>
              <div className={`w-[5rem] font-semibold`}>타입</div>
              <div className='mt-[0.25rem] ps-[0.25rem] md:ps-0'>{props.selectedData.induty || "타입 정보 없음"}</div>
            </div>

            {/* 캠핑장 태그 */}
            <div className={`flex flex-col md:flex-row`}>
              <div className={`w-[5rem] font-semibold`}>태그</div>
              <div className={`flex flex-wrap space-x-[0.5rem] mt-[0.25rem] ps-[0.25rem] md:ps-0`}>
                {tags.map((tag, index) => (
                  <div key={index} className={`px-[0.25rem] py-[0.1rem] bg-light-bgbasic dark:bg-dark-bgbasic dark:text-dark-text-secondary text-sm rounded font-medium`}>
                    {tag}
                  </div>
                ))}
              </div>
            </div>

            {/* 캠핑장 정보 */}
            <div className={`flex flex-col md:flex-row`}>
              <div className={`w-[5rem] font-semibold`}>정보</div>
              <div className={`w-full break-all text-justify`}>
                {introduction}
              </div>
            </div>

            {/* 캠핑장 전화 */}
            <div className={`flex flex-col md:flex-row`}>
              <div className={`w-[5rem] font-semibold`}>문의전화</div>
              <div className='mt-[0.25rem] ps-[0.25rem] md:ps-0'>{props.selectedData.tel || "전화번호 없음"}</div>
            </div>

            {/* 캠핑장 타입 */}
            <div className={`flex flex-col md:flex-row`}>
              <div className={`w-[6rem] font-semibold`}>개인 카라반</div>
              <div className='mt-[0.25rem] ps-[0.25rem] md:ps-0'>{props.selectedData.caravAcmpnyAt || "정보 없음"}</div>
            </div>

            {/* 개인 트레일러 동반여부 */}
            <div className={`flex flex-col md:flex-row`}>
              <div className={`w-[6rem] font-semibold`}>개인 트레일러</div>
              <div className='mt-[0.25rem] ps-[0.25rem] md:ps-0'>{props.selectedData.trlerAcmpnyAt || "정보 없음"}</div>
            </div> 
          </div>

          {/* 날씨 확인 */}
          <div className='mb-[1rem]'>
            <p className='font-semibold'>날씨<span>(최근 7일)</span></p>
            <div className='bg-slate-200 w-full h-[8rem]'></div>
          </div>

          {/* 추가 링크 */}
          <div className='flex'>
            {props.selectedData.homepage ? (
              <a href={props.selectedData.homepage} target="_blank" rel="noopener noreferrer">
                <button className='max-md:w-1/2 me-[0.5rem] md:px-[1.5rem] py-[0.5rem] bg-light-gray hover:bg-light-signature hover:text-light-white dark:bg-dark-gray dark:hover:bg-dark-signature transition duration-300'>
                  홈페이지
                </button>
              </a>
            ) : (
              <button
                className='max-md:w-1/2 me-[0.5rem] md:px-[1.5rem] py-[0.5rem] bg-light-gray text-gray-500 cursor-not-allowed dark:bg-dark-gray dark:text-gray-500'
                disabled
              >
                홈페이지
              </button>
            )}

            {props.selectedData.resveUrl ? (
              <a href={props.selectedData.resveUrl} target="_blank" rel="noopener noreferrer">
                <button className='max-md:w-1/2 me-[0.5rem] md:px-[1.5rem] md:py-[0.5rem] bg-light-gray hover:bg-light-signature hover:text-light-white dark:bg-dark-gray dark:hover:bg-dark-signature transition duration-300'>
                  예약하기
                </button>
              </a>
            ) : (
              <button
                className='max-md:w-1/2 me-[0.5rem] md:px-[1.5rem] md:py-[0.5rem] bg-light-gray text-light-gray-2 cursor-not-allowed dark:bg-dark-gray dark:text-dark-gray-2'
                disabled
              >
                예약하기
              </button>
            )}
          </div>

          {/* 캠핑장 후기 */}
          <div className='my-[2rem]'>
            <CampingReviewList />
          </div>
        </div>
      </>
    );
  }

  return (
    <div>
      {/* 모달 */}
      <div
        ref={modalRef}
        className={`
          ${props.isModalOpen ? 'block bg-black bg-opacity-60 inset-0' : 'hidden'}
          fixed z-[20]
        `}
        onClick={props.modalClose}
      ></div>

      <div
        className={`
          ${props.isModalOpen ? 'translate-y-0 lg:translate-x-0' : 'translate-y-full lg:translate-x-full'}
          ${props.isModalBlocked ? 'block' : 'hidden'}
          fixed lg:top-0 bottom-0 lg:right-0 z-[30] w-full lg:w-[50rem] h-[80vh] lg:h-full lg:p-[4rem] px-0 sm:px-[3rem]
          bg-light-white
          dark:bg-dark-white
          overflow-y-auto transform transition-transform duration-300 ease-in-out lg:translate-y-0 overflow-hidden
        `}
        onTransitionEnd={props.handleTransitionEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 닫기 */}
        <CloseIcon
          onClick={props.modalClose}
          className='
            hidden lg:block absolute top-[0.75rem] right-[0.75rem] size-[1.8rem]
            fill-light-border-icon
            dark:fill-dark-border-icon
            cursor-pointer
          '
        />

        {/* 전체 내용 */}
        <div className='flex flex-col'>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default CampingDetail