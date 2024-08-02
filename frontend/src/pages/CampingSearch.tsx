import CampingList from '@components/CampingSearch/CampingList';
import React, { useState, useEffect, useRef } from 'react';

import { ReactComponent as SearchIcon } from '@assets/icons/nav-search.svg';
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg';
import { ReactComponent as FilterIcon } from '@assets/icons/filter2.svg';

import CampingDetail from '@components/CampingSearch/CampingDetail';

const geolocationOptions = {
  enableHighAccuracy: true,
  timeout: 1000 * 10,
  maximumAge: 1000 * 3600 * 24,
}

type PosType = {
  lat: number,
  lng: number
}

function CampingSearch() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalBlocked, setIsModalBlocked] = useState<boolean>(false);
  const currentLat = useRef(36.110336);
  const currentLng = useRef(128.4112384);
  const [map, setMap] = useState<naver.maps.Map | null>(null);

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
    setCurrentPos()

    try {
      const mapOptions = {
        center: new naver.maps.LatLng(currentLat.current, currentLng.current),
        zoom: 15
      };
    
      const mapInstance = new naver.maps.Map('map', mapOptions);
      setMap(mapInstance); // map 객체를 상태에 저장
    } catch (error) {
      console.log(error)
      console.log("Kakao map not loaded")
    }
    return () => {
      setIsModalOpen(false);
      setIsModalBlocked(false);
    };
  }, []);

  const setCurrentPos = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        currentLat.current = pos.coords.latitude
        currentLng.current = pos.coords.longitude
      }, 
      (error) => {
        console.log(error)
        currentLat.current = 36.110336
        currentLng.current = 128.4112384
      },
      geolocationOptions
    );
  }

  const moveMapCenter = (lat: number, lng: number) => {
    if (map) {
      const newCenter = new naver.maps.LatLng(lat, lng);
      map.setCenter(newCenter); // 지도의 중심을 변경
    }
  };

  const moveMapCurrent = () => {
    setCurrentPos()
    moveMapCenter(currentLat.current, currentLng.current)
  }

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
          
          <div className='relative w-[100%] lg:size-[40rem] aspect-[4/3]'>
            <div 
              className={`
                w-[100%] lg:size-[40rem] 
                bg-light-black 
                dark:bg-dark-black 
                aspect-[4/3]
              `}
              id='map'
            />
            <div 
              onClick={moveMapCurrent}
              className='
                absolute top-0 right-0 w-[4rem] h-[4rem] bg-black z-[100]
              '
            >
            </div>
          </div>
          
          <div className={`w-[100%] lg:w-[calc(100%-40rem-1rem)] lg:min-w-[30rem] lg:h-[100%] lg:ms-[1rem] my-[0.75rem] lg:my-0`}>
            <div className={`h-[3rem]`}>
              <div className={`relative w-[100%]`}>
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