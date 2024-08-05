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
  districts: string[];
}

type FilterCondition = {
  type: 'Location' | 'Normal';
  text: string;
};

function CampingSearch() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalBlocked, setIsModalBlocked] = useState<boolean>(false);

  const [filterCondition, setFilterCondition] = useState<FilterCondition[]>([]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<SelecetedLocType | null>(null);

  const currentLat = useRef(35.9078);
  const currentLng = useRef(127.7669);
  const [map, setMap] = useState<naver.maps.Map | null>(null);

  const handleSelect = (city: string, districts: string[]) => {
    setSelectedLocation({ city, districts });
    console.log(city, districts)
  };

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
    setCurrentPos();

    const loadNaverMap = () => {
      return new Promise((resolve, reject) => {
        const naverMapApiKey = process.env.REACT_APP_NAVERMAP_API_KEY;
        const script = document.createElement('script');
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${naverMapApiKey}`;
        script.onload = () => resolve(window.naver);
        script.onerror = () => reject(new Error('Naver Map script load error'));
        document.head.appendChild(script);
      });
    };

    loadNaverMap().then((naver) => {
      const mapOptions = {
        center: new window.naver.maps.LatLng(currentLat.current, currentLng.current),
        zoom: 8,
      };
      const mapInstance = new window.naver.maps.Map('map', mapOptions);
      setMap(mapInstance); // map 객체를 상태에 저장
    }).catch((error) => {
      console.log(error);
      console.log("Naver map not loaded");
    });

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


  useEffect(() => {
    setFilterCondition(prevConditions => {
      // 이전의 Location 타입 조건을 제거
      const updatedConditions = prevConditions.filter(condition => condition.type !== 'Location');
      
      if (selectedLocation===null) return updatedConditions;

      // 새로운 조건 추가
      const { city, districts } = selectedLocation;
      
      if (city !== "전체") {
        if (districts.includes("전체")) {
          // 시/도만 선택된 경우
          updatedConditions.push({
            type: 'Location',
            text: city
          });
        } else {
          // 특정 구/군들이 선택된 경우
          districts.forEach(district => {
            updatedConditions.push({
              type: 'Location',
              text: `${city} ${district}`
            });
          });
        }
      }
      
      return updatedConditions;
    });

    console.log(filterCondition)
  }, [selectedLocation])

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
            
            <div className={`${filterCondition.length > 1 ? 'h-[2rem]' : 'h-0'}`}>
              
            </div>

            <div className={`${filterCondition.length > 1 ? 'lg:h-[33.5rem]' : 'lg:h-[35.5rem]'} overflow-y-auto scrollbar-hide`}>
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
