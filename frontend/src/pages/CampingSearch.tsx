import CampingList from '@components/CampingSearch/CampingList';
import React, { useState, useEffect } from 'react';

import { ReactComponent as SearchIcon } from '@assets/icons/nav-search.svg';
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg';
import { ReactComponent as FilterIcon } from '@assets/icons/filter2.svg';

import CampingDetail from '@components/CampingSearch/CampingDetail';

const { kakao } = window;

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
    try {
      const container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
      const options = { //지도를 생성할 때 필요한 기본 옵션
        center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
        level: 3 //지도의 레벨(확대, 축소 정도)
      };

      const map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
    } catch {
      console.log("Kakao map not loaded")
    }

    return () => {
      setIsModalOpen(false);
      setIsModalBlocked(false);
    };
  }, []);

  useEffect(() => {
    const currentScrollY = window.scrollY;
    const contentBox = document.querySelector('#contentBox') as HTMLElement;
    if (isModalOpen) {
      // 모달이 열릴 때 스크롤 방지
      contentBox.classList.add('no-scroll');
      contentBox.style.top = `-${currentScrollY}px`;
      contentBox.style.zIndex = '20';
      console.log(contentBox.style.top)
    } else {
      // 모달이 닫힐 때 스크롤 허용
      const scrollY = parseInt(contentBox.style.top || '0') * -1;
      contentBox.style.top = '';
      contentBox.style.zIndex = '';
      contentBox.classList.remove('no-scroll');
      window.scrollTo(0, scrollY || currentScrollY);
    }
  }, [isModalOpen]);

  return (
    <div className={`lg:h-[calc(100vh-3.2rem)] z-[30]`}>
      {/* 메인 화면 */}
      <div className={`flex justify-center items-center h-[calc(100%-3.2rem)]`}>
        <div className={`flex flex-all-center flex-col lg:flex-row w-[100%] md:max-w-[48rem] lg:max-w-[80rem] lg:h-[40rem] ms-[0.5rem] me-[0.5rem]`}>
          <div className={`w-[100%] lg:size-[40rem] bg-light-black dark:bg-dark-black aspect-[4/3]`}>지도</div>
          <div className={`w-[100%] lg:w-[calc(100%-40rem)] lg:min-w-[20rem] lg:h-[100%] my-[0.75rem] lg:my-0`}>
            <div className={`h-[3rem]`}>
              <div className={`relative w-[calc(100%-2rem)] mx-[1rem]`}>
                <div className={`absolute left-[0.75rem] top-[0.9rem]`}>
                  <SearchIcon
                    className={`
                      size-[1rem]
                      stroke-light-border-icon
                      dark:stroke-dark-border-icon
                    `} 
                  />
                </div>
                <input
                  type="text"
                  placeholder="검색어를 입력하세요."
                  className={`
                    w-[100%] px-[3rem] py-[0.75rem]
                    bg-light-gray
                    dark:bg-dark-gray
                    text-sm focus:outline-0 rounded-md
                  `}
                />
                <div className={`absolute right-[0.75rem] top-[0.75rem]`}>
                  <CloseIcon
                    className={`
                      size-[1.25rem]
                      fill-light-gray
                      dark:fill-dark-gray
                    `}
                  />
                </div>
              </div>
            </div>
            <div className={`flex h-[1.5rem] mx-[1rem]`}>
              <div>필터</div>
              <FilterIcon className={`fill-light-black dark:fill-dark-black`}/>
            </div>
            <div className={`lg:h-[35.5rem] overflow-y-auto scrollbar-hide`}>
              <CampingList modalOpen={modalOpen} />
            </div>
          </div>
        </div>
      </div>

      {/* 모달 */}
      <CampingDetail isModalOpen={isModalOpen} isModalBlocked={isModalBlocked} modalClose={modalClose} handleTransitionEnd={handleTransitionEnd}/>
    </div>
  );
}

export default CampingSearch;
