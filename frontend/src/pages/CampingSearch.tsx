import React, { useState, useEffect, useRef } from 'react';
import { ReactComponent as SearchIcon } from '@assets/icons/nav-search.svg';
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg';
import { ReactComponent as FilterIcon } from '@assets/icons/filter3.svg';
import CampingDetail from '@components/CampingSearch/CampingDetail';
import LocationFilter from '@components/Public/LocationFilter';
import CampingDetailFilter from '@components/CampingSearch/CampingDetailFilter';
import { koreaAdministrativeDivisions } from '@utils/koreaAdministrativeDivisions';
import Camping, {CampingDataType} from '@components/CampingSearch/Camping';

import { filterCategories } from '@components/CampingSearch/CampingDetailFilter';
import { campingLoadRating } from '@services/campingService';
import { useInView } from 'react-intersection-observer';
import { set } from 'react-datepicker/dist/date_utils';

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
  type: 'location' | 'induty' | 'lctCl' | 'sbrsCl' | 'posblFcltyCl' | 'animalCmgCl';
  value: string;
};

type DetailFilterType = {
  [key: string]: string[];
};

type Rating = {
  campsiteId: number;
  averageRate: number;
  reviewCount: number;
}

function CampingSearch() {
  const [ref, inView] = useInView();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalBlocked, setIsModalBlocked] = useState<boolean>(false);

  const [filterCondition, setFilterCondition] = useState<FilterCondition[]>([]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<SelecetedLocType | null>(null);

  const currentLat = useRef(35.9078);
  const currentLng = useRef(127.7669);
  const [map, setMap] = useState<naver.maps.Map | null>(null);

  const [isDetailFilterOpen, setIsDetailFilterOpen] = useState(false);

  const initialDetailFilters: DetailFilterType = {};
  // filterCategories 배열을 순회하며 초기값을 설정
  filterCategories.forEach(category => {
    initialDetailFilters[category.name] = ["전체"]; // 모든 카테고리의 초기값을 "전체"로 설정
  });
  const [detailFilters, setDetailFilters] = useState<DetailFilterType>(initialDetailFilters);

  const [campingData, setCampingData] = useState<CampingDataType[]>([]);
  const [filteredData, setFilteredData] = useState<CampingDataType[]>([]);
  const [visibleCount, setVisibleCount] = useState(10); // 처음에 보여줄 camping 개수
  const [selectedCampingData, setSelectedCampingData] = useState<CampingDataType | null>(null);

  const handleSelect = (city: string, districts: string[]) => {
    setSelectedLocation({ city, districts });
    console.log(city, districts)
  };

  const handleDetailFilterSelect = (filters: DetailFilterType) => {
    setDetailFilters(filters);
    console.log(filters)
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
  const modalOpen = (selectedData: CampingDataType) => {
    setSelectedCampingData(selectedData)
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

    // 캠핑 데이터 지연로딩
    const loadData = async () => {
      const response = await import('@utils/campingData.json') as { default: CampingDataType[] };
      setCampingData(response.default);
    };

    loadData();

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
      const updatedConditions = prevConditions.filter(condition => condition.type !== 'location');
      
      if (selectedLocation===null) return updatedConditions;

      // 새로운 조건 추가
      const { city, districts } = selectedLocation;
      
      if (city !== "전체") {
        if (districts.includes("전체")) {
          // 시/도만 선택된 경우
          updatedConditions.push({
            type: 'location',
            value: city
          });
        } else {
          // 특정 구/군들이 선택된 경우
          districts.forEach(district => {
            updatedConditions.push({
              type: 'location',
              value: `${city} ${district}`
            });
          });
        }
      }
      console.log(updatedConditions)
      
      return updatedConditions;
    });
  }, [selectedLocation])

  useEffect(() => {
    setFilterCondition(prevConditions => {
      // 이전의 Filter 타입 조건을 제거
      const updatedConditions = prevConditions.filter(condition => condition.type === 'location');

      // 새로운 조건 추가
      Object.keys(detailFilters).forEach(key => {
        let type: 'induty' | 'lctCl' | 'sbrsCl' | 'posblFcltyCl' | 'animalCmgCl';
        if (key === '야영장 타입') {
          type = 'induty'
        } else if (key === '입지구분') {
          type = 'lctCl'
        } else if (key === '부대시설') {
          type = 'sbrsCl'
        } else if (key === '주변시설') {
          type = 'posblFcltyCl'
        } else if (key === '반려동물') {
          type = 'animalCmgCl'
        }
        const values = detailFilters[key];
        // values가 배열이므로 각 값에 대해 조건 추가
        values.forEach(value => {
          if (value !== "전체") {  // "전체"가 아닌 경우에만 조건 추가
            updatedConditions.push({
              type: type,
              value: value
            });
          }
        });
      });
      
      return updatedConditions;
    });
  }, [detailFilters])

  // 필터링 로직
  useEffect(() => {
    console.log(123)

    const campingListDiv = document.querySelector('#campingList'); // contentBox의 ID로 선택
    if (campingListDiv) {
      campingListDiv.scrollTop = 0; // 스크롤을 최상단으로 이동
    }

    const applyFilters = () => {
      return campingData.filter(camping => {
        return filterCondition.every(condition => {
          if (condition.type === 'location') {
            // location 필터링
            const [doNm, sigunguNm] = condition.value.split(' '); // 시도와 시군구로 분리
            const doNmMatch = camping.doNm ? camping.doNm.includes(doNm) : false;
            const sigunguNmMatch = camping.sigunguNm ? camping.sigunguNm.includes(sigunguNm) : false;
            return doNmMatch && sigunguNmMatch; // 둘 다 만족해야 함
          } else {
            // 다른 조건 필터링
            const campingValue = camping[condition.type];
            return campingValue ? campingValue.split(',').includes(condition.value) : false;
          }
        });
      });
    };

    const filtered = applyFilters();
    const initialIds = filtered.slice(0, 10)
      .map(camping => camping.campsiteId)
      .filter((id): id is number => id !== undefined); // id가 number인 경우만 필터링

    if (filtered.length === 0) {
      setFilteredData([]);
      return; // 이후 코드 실행을 중지
    }

    const firstLoad = async () => {
      try {
        if (initialIds.length > 0) {
          const response = await campingLoadRating(initialIds);
          const ratingsData: Rating[] = response.data.data; // API 응답에서 데이터 추출 및 타입 지정
    
          console.log(ratingsData)
          const updatedData = filtered.map(camping => {
            const ratingInfo = ratingsData.find((rating: Rating) => rating.campsiteId === camping.campsiteId);
            if (camping.campsiteId !== undefined && initialIds.includes(camping.campsiteId)) {
              return {
                ...camping,
                averageRate: ratingInfo ? ratingInfo.averageRate : 0, // 평점이 없으면 0
                reviewCount: ratingInfo ? ratingInfo.reviewCount : 0  // 리뷰 수가 없으면 0
              };
            }
  
            // 매칭되지 않는 캠핑장은 그대로 반환
            return camping;
          });
    
          setFilteredData(updatedData); // 업데이트된 filteredData를 상태에 설정
        }
      } catch (error) {
        console.log(error);
      }
    };

    firstLoad()
    setVisibleCount(10)
  }, [filterCondition, campingData]);

  useEffect(() => {
    const contentBox = document.querySelector('#contentBox') as HTMLElement;
    if (isModalOpen) {
      contentBox.classList.add('md:scrollbar-hide')
    } else {
      contentBox.classList.remove('md:scrollbar-hide')
    }
  }, [isModalOpen])

  useEffect(() => {
    if (inView) {
      console.log(inView, '무한 스크롤 요청');
      // filteredData의 길이가 visibleCount보다 큰지 확인
      if (visibleCount < filteredData.length) {
        setVisibleCount((prevCount) => Math.min(prevCount + 10, filteredData.length));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [inView, filteredData.length]); // filteredData의 길이도 의존성 배열에 추가

  const sendLoadRatingRequest = async (newIds: number[]) => {
    try {
      const response = await campingLoadRating(newIds)
      const ratingsData: Rating[] = response.data.data; // API 응답에서 데이터 추출 및 타입 지정
      // filteredData 업데이트
      console.log(ratingsData)
      setFilteredData(prevData =>
        prevData.map(camping => {
          // 캠핑장 ID에 따라 평점 및 리뷰 수 추가
          const ratingInfo = ratingsData.find((rating: Rating) => rating.campsiteId === camping.campsiteId);
          // camping.campsiteId가 정의되어 있고 newIds에 포함되어 있는 경우에만 업데이트
          if (camping.campsiteId !== undefined && newIds.includes(camping.campsiteId)) {
            return {
              ...camping,
              averageRate: ratingInfo ? ratingInfo.averageRate : 0, // 평점이 없으면 0
              reviewCount: ratingInfo ? ratingInfo.reviewCount : 0  // 리뷰 수가 없으면 0
            };
          }

          // 매칭되지 않는 캠핑장은 그대로 반환
          return camping;
        })
      );
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    const newlyLoadedData = filteredData.slice(visibleCount - 10, visibleCount);
    if (newlyLoadedData.length > 0) {
      const newIds = newlyLoadedData
        .map(camping => camping.campsiteId)
        .filter((id): id is number => id !== undefined);
      if (newIds.length > 0) {
        sendLoadRatingRequest(newIds);
      }
    }
  }, [visibleCount]);

  useEffect(() => {
    console.log(filteredData)
  }, [filteredData])

  return (
    <div className={`z-[30]`}>
      {/* 메인 화면 */}
      <div className={`flex flex-col justify-center items-center min-h-screen`}>
        <h2 className='w-[100%] md:max-w-[48rem] lg:max-w-[80rem] font-bold text-4xl mb-[1.8rem]'>캠핑장 검색</h2>
        <div 
          className={`
            flex flex-col lg:flex-row w-[100%] md:max-w-[48rem] lg:max-w-[80rem] lg:h-[42rem] p-[0.75rem] mx-[0.5rem]
            bg-light-white bg-opacity-80
            dark:bg-dark-white dark:bg-opacity-80

          `}
        >
              
          {/* 캠핑지도 */}
          <div className='relative w-full lg:min-w-[400px] lg:max-w-[50rem] h-[30rem] lg:h-full lg:aspect-auto'>
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
            className={`flex flex-col w-full lg:min-w-[470px] lg:h-full lg:ms-[1rem] mt-[0.75rem] lg:mt-0`}>
            
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
            <div className="flex flex-wrap gap-2 mt-2 mb-2">
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
                options
                  .filter(option => option !== "전체")  // "전체"가 아닌 옵션만 필터링
                  .map(option => (
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
                flex-grow
                bg-light-white
                dark:bg-dark-white
                overflow-y-auto
              `}
              id='campingList'
            >
              {filteredData.slice(0, visibleCount).map((camping, index) => (
                <Camping 
                  key={index} 
                  camping={camping} 
                  modalOpen={modalOpen}
                />
              ))}
                
              <div ref={ref} className={`${filteredData.length >= 1 ? 'block' : 'hidden'} h-[0.25rem]`}></div>
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
        selectedData={selectedCampingData}
      />
    </div>
  );
}

export default CampingSearch;
