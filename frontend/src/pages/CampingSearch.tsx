import CampingList from '@components/CampingSearch/CampingList';
import React, { useState, useEffect } from 'react';

import { ReactComponent as SearchIcon } from '@assets/icons/nav-search.svg';
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg';

import { ReactComponent as FilterIcon } from '@assets/icons/filter2.svg';

function CampingSearch() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalBlocked, setIsModalBlocked] = useState<boolean>(false);

  // 모달이 오픈될때 Modal을 block시킴
  const modalOpen = () => {
    setIsModalBlocked(true);
  };

  // 모달닫기
  const modalClose = () => {
    setIsModalOpen(false);
  };

  // transition이 끝났을때 모달이 닫겨있으면 blocked를 false로 돌려서 hidden처리
  const handleTransitionEnd = () => {
    if (!isModalOpen) {
      setIsModalBlocked(false);
    }
  };

  // isModalBlocked값이 변할때 true면 Modal을 오픈하도록함. 즉 모달이 block되고 Modal이 open됨
  useEffect(() => {
    if (isModalBlocked) {
      setIsModalOpen(true);
    }
  }, [isModalBlocked]);

  // 다른 페이지로 이동할때는 항상 Modal Blocked 비활성화하기
  useEffect(() => {
    return () => {
      setIsModalOpen(false);
      setIsModalBlocked(false);
    };
  }, []);

  return (
    <div className="lg:h-screen">
      {/* 메인 화면 */}
      <div className="flex h-[calc(100%-3.2rem)] justify-center items-center">
        <div className="ms-2 me-2 flex flex-all-center flex-col lg:flex-row lg:h-[40rem] w-full lg:max-w-[80rem] md:max-w-3xl">
          <div className="bg-black aspect-[4/3] w-full lg:size-[40rem]">지도</div>
          <div className="w-full my-3 lg:my-0 lg:w-[calc(100%-40rem)] lg:min-w-[20rem] lg:h-full">
            <div className="h-[3rem]">
              <div className="relative w-[calc(100%-2rem)] mx-[1rem]">
                <div className="absolute left-[0.75rem] top-[0.9rem]">
                  <SearchIcon stroke="#777777" className="size-[1rem]" />
                </div>
                <input
                  type="text"
                  placeholder="검색어를 입력하세요."
                  className="text-sm focus:outline-0 rounded-md bg-[#EEEEEE] px-[3rem] py-[0.75rem] w-full"
                />
                <div className="absolute right-[0.75rem] top-[0.75rem]">
                  <CloseIcon fill="#777777" className="size-[1.25rem] " />
                </div>
              </div>
            </div>
            <div className="h-[1.5rem] flex mx-[1rem]">
              <div>필터</div>
              <FilterIcon />
            </div>
            <div className="lg:h-[35.5rem] overflow-y-auto scrollbar-hide">
              <CampingList modalOpen={modalOpen} />
            </div>
          </div>
        </div>
      </div>

      {/* 모달 */}
      <div>
        <div
          className={`fixed z-20 bg-opacity-75 ${isModalOpen ? 'bg-gray-500 inset-0 block' : 'bg-none hidden'}`}
          onClick={modalClose}
        ></div>
        <div
          className={`fixed z-30 md:px-[10%] md:py-[5%] lg:p-[5rem]
            overflow-y-auto scrollbar-hide
            w-full h-[80vh] bottom-0 md:w-full md:h-[50vh] 
            lg:right-0 lg:top-0 lg:h-full lg:w-[60rem] bg-[#EEEEEE] transform transition-transform duration-300 ease-in-out lg:translate-y-0 
            ${isModalOpen ? 'translate-y-0 lg:translate-x-0' : 'translate-y-full lg:translate-x-full'}
            ${isModalBlocked ? 'block' : 'hidden'}
            `}
          onTransitionEnd={handleTransitionEnd}
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
    </div>
  );
}

export default CampingSearch;
