import CampingList from '@components/CampingSearch/CampingList';
import React, { useState, useEffect, useRef } from 'react';

import { ReactComponent as SearchIcon } from '@assets/icons/nav-search.svg';
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg';
import { ReactComponent as FilterIcon } from '@assets/icons/filter2.svg';

import CampingDetail from '@components/CampingSearch/CampingDetail';
import CampingFilter from '@components/CampingSearch/CampingFilter';

import { koreaAdministrativeDivisions } from '@utils/koreaAdministrativeDivisions';

const geolocationOptions = {
  enableHighAccuracy: true,
  timeout: 1000 * 10,
  maximumAge: 1000 * 3600 * 24,
}

type SelecetedLocType = {
  city: string; 
  district: string;
  lat: number;
  lng: number;
}

function CampingSearch() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalBlocked, setIsModalBlocked] = useState<boolean>(false);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<SelecetedLocType>({city: '전체', district: '전체', lat: 35.9078, lng: 127.7669});

  const handleSelect = (city: string, district: string, lat: number, lng: number) => {
    setSelectedLocation({ city, district, lat, lng });
    console.log(city, district, lat, lng)
  };

  const currentLat = useRef(35.9078);
  const currentLng = useRef(127.7669);
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
        zoom: 8
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
        currentLat.current = 35.9078
        currentLng.current = 127.7669
      },
      geolocationOptions
    );
  }

  // 중심 이동
  const moveMapCenter = (lat: number, lng: number, zoomLevel: number = 15) => {
    if (map) {
      const newCenter = new naver.maps.LatLng(lat, lng);
      map.setCenter(newCenter); // 지도의 중심을 변경
      map.setZoom(zoomLevel)
    }
  };

  const moveMapCurrent = () => {
    setCurrentPos()
    moveMapCenter(currentLat.current, currentLng.current)
  }

  // 여기서 이제 지역필터를 확인 하는순간 위치 변화되도록
  useEffect(() => {
    if (selectedLocation?.city === '전체') {
      moveMapCenter(selectedLocation.lat, selectedLocation.lng, 8)
    } else if (selectedLocation?.district === '전체') {
      // city는 선택되고 district는 선택안됐을때
      moveMapCenter(selectedLocation.lat, selectedLocation.lng, 9)
    } else {
      // city, districts 둘다 선택됐을때
      moveMapCenter(selectedLocation.lat, selectedLocation.lng, 14)
    }
  }, [selectedLocation])

  useEffect(() => {
    
    const contentBox = document.querySelector('#contentBox') as HTMLElement;
    const currentScrollY = window.scrollY;

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
                z-[0] w-[100%] lg:size-[40rem]
                bg-light-black 
                dark:bg-dark-black 
                aspect-[4/3]
              `}
              id='map'
            />
            <div 
              onClick={moveMapCurrent}
              className='
                absolute top-0 right-0 z-[0] w-[4rem] h-[4rem] bg-black
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
            <div onClick={() => setIsFilterOpen(true)} className='flex h-[1.5rem] mx-[1rem] cursor-pointer'>
              <div>필터</div>
              <FilterIcon className={`fill-light-black dark:fill-dark-black`}/>
            </div>
            <CampingFilter 
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              divisions={koreaAdministrativeDivisions}
              onSelect={handleSelect}
              selectedLocation={selectedLocation}
            />
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
