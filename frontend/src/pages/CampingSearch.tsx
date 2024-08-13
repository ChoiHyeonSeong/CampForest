import React, { useState, useEffect, useRef } from 'react';
import { ReactComponent as SearchIcon } from '@assets/icons/nav-search.svg';
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg';
import { ReactComponent as FilterIcon } from '@assets/icons/filter3.svg';
import CampingList from '@components/CampingSearch/CampingList';
import CampingDetail from '@components/CampingSearch/CampingDetail';
import LocationFilter from '@components/Public/LocationFilter';
import CampingDetailFilter from '@components/CampingSearch/CampingDetailFilter';
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

type DetailFilterType = {
  [key: string]: string[];
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

  const [isDetailFilterOpen, setIsDetailFilterOpen] = useState(false);
  const [detailFilters, setDetailFilters] = useState<DetailFilterType>({});

  const handleSelect = (city: string, districts: string[]) => {
    setSelectedLocation({ city, districts });
    console.log(city, districts)
  };

  const handleDetailFilterSelect = (filters: DetailFilterType) => {
    setDetailFilters(filters);
  };

  const removeLocationFilter = (filter: string) => {
    if (selectedLocation) {
      const [city, district] = filter.split(' ');
      if (district) {
        setSelectedLocation(prev => ({
          ...prev!,
          districts: prev!.districts.filter(d => d !== district)
        }));
      } else {
        setSelectedLocation(null);
      }
    }
  };

  const removeDetailFilter = (category: string, option: string) => {
    setDetailFilters(prev => {
      const updatedCategory = prev[category].filter(item => item !== option);
      if (updatedCategory.length === 0) {
        const { [category]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [category]: updatedCategory };
    });
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

  useEffect(() => {
    const contentBox = document.querySelector('#contentBox') as HTMLElement;
    if (isModalOpen) {
      contentBox.classList.add('md:scrollbar-hide')
    } else {
      contentBox.classList.remove('md:scrollbar-hide')
    }
  }, [isModalOpen])


  return (
    <div className={`z-[30]`}>
      {/* 메인 화면 */}
      <div className={`flex flex-col justify-center items-center min-h-screen md:py-[2rem] lg:py-0 lg:px-[2rem]`}>
        <h2 className='hidden md:block w-[100%] md:max-w-[48rem] lg:max-w-[80rem] font-bold text-4xl mb-[1.8rem]'>캠핑장 검색</h2>
        <div 
          className={`
            flex flex-col lg:flex-row w-[100%] md:max-w-[48rem] lg:max-w-[80rem] lg:h-[42rem] p-[0.75rem] mx-[0.5rem]
            bg-light-white bg-opacity-80
            dark:bg-dark-white dark:bg-opacity-80

          `}
        >
              
          {/* 캠핑지도 */}
          <div className='relative w-full lg:w-[40%] h-[20rem] sm:h-[24rem] lg:h-full'>
            <div 
              className={`
               z-[0] w-[100%] h-[100%]
              bg-light-black 
              dark:bg-dark-black 
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
          
          {/* 캠핑장리스트 */}
          <div
            className={`flex flex-col w-full lg:w-[60%] lg:h-full lg:ms-[1rem] mt-[0.75rem] lg:mt-0`}>
            
            {/* 검색창 */}
            <div className={`h-[3rem] mb-[0.75rem]`}>
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

            {/* 필터 */}
            <div className="flex space-x-2 mt-[0.75rem]">
              <div
                onClick={() => setIsFilterOpen(true)}
                className='
                  flex items-center w-fit h-fit px-[0.5rem] py-[0.25rem]
                  bg-light-bgbasic dark:bg-dark-bgbasic
                  cursor-pointer rounded
                '
              >
                <div className='me-[0.3rem] font-medium'>지역필터</div>
                <FilterIcon 
                  className={`
                    size-[0.85rem]
                    fill-light-border-icon
                    dark:fill-dark-border-icon
                  `}
                />
              </div>
              <div
                onClick={() => setIsDetailFilterOpen(true)}
                className='
                  flex items-center w-fit h-fit px-[0.5rem] py-[0.25rem]
                  bg-light-bgbasic dark:bg-dark-bgbasic
                  cursor-pointer rounded
                '
              >
                <div className='me-[0.3rem] font-medium'>상세필터</div>
                <FilterIcon 
                  className={`
                    size-[0.85rem]
                    fill-light-border-icon
                    dark:fill-dark-border-icon
                  `}
                />
              </div>
            </div>
            
            {/* 선택한 태그를 띄우기 */}
            <div className="flex flex-wrap gap-2 mt-2 mb-[1rem]">
              {selectedLocation && selectedLocation.city !== '전체' && (
                selectedLocation.districts.includes('전체') ? (
                  <div className="flex items-center bg-light-gray dark:bg-dark-gray px-2 py-1 rounded-full text-sm">
                    <span>{selectedLocation.city}</span>
                    <button onClick={() => removeLocationFilter(selectedLocation.city)} className="ml-1">
                      <CloseIcon className="w-4 h-4 fill-light-border-icon dark:fill-dark-border-icon" />
                    </button>
                  </div>
                ) : (
                  selectedLocation.districts.map(district => (
                    <div key={`${selectedLocation.city} ${district}`} className="flex items-center bg-light-gray dark:bg-dark-gray px-2 py-1 rounded-full text-sm">
                      <span>{`${selectedLocation.city} ${district}`}</span>
                      <button onClick={() => removeLocationFilter(`${selectedLocation.city} ${district}`)} className="ml-1">
                        <CloseIcon className="w-4 h-4 fill-light-border-icon dark:fill-dark-border-icon" />
                      </button>
                    </div>
                  ))
                )
              )}
              {Object.entries(detailFilters).map(([category, options]) => 
                options.map(option => (
                  <div key={`${category}-${option}`} className="flex items-center bg-light-gray dark:bg-dark-gray px-2 py-1 rounded-full text-sm">
                    <span>{`${category}: ${option}`}</span>
                    <button onClick={() => removeDetailFilter(category, option)} className="ml-1">
                      <CloseIcon className="w-4 h-4 fill-light-border-icon dark:fill-dark-border-icon" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* 캠핑리스트 목록 */}
            <div
              className={`
                flex-grow p-[0.5rem]

                overflow-y-auto
              `}
            >
              <p className='mb-[0.75rem] font-medium text-lg'>캠핑장 목록</p>
              <CampingList modalOpen={modalOpen} />
            </div>

          </div>
        </div>
      </div>


      {/* 모달모음 */}

      {/* 지역필터 모달 */}
      <LocationFilter 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        divisions={koreaAdministrativeDivisions}
        onSelect={handleSelect}
        selectedLocation={selectedLocation}
      />
            
      {/* 상세필터 모달 */}
      <CampingDetailFilter
        isOpen={isDetailFilterOpen}
        onClose={() => setIsDetailFilterOpen(false)}
        onSelect={handleDetailFilterSelect}
        selectedFilters={detailFilters}
      />

      {/* 캠핑 세부 정보모달 */}
      <CampingDetail
        isModalOpen={isModalOpen}
        isModalBlocked={isModalBlocked}
        modalClose={modalClose}
        handleTransitionEnd={handleTransitionEnd}
      />
    </div>
  );
}

export default CampingSearch;
