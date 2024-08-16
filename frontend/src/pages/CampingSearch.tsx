import React, { useState, useEffect, useRef } from 'react';
import { ReactComponent as SearchIcon } from '@assets/icons/nav-search.svg';
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg';
import { ReactComponent as FilterIcon } from '@assets/icons/filter3.svg';
import CampingDetail from '@components/CampingSearch/CampingDetail';
import LocationFilter from '@components/Public/LocationFilter';
import CampingDetailFilter from '@components/CampingSearch/CampingDetailFilter';
import { koreaAdministrativeDivisions } from '@utils/koreaAdministrativeDivisions';
import Camping, { CampingDataType } from '@components/CampingSearch/Camping';

import { filterCategories } from '@components/CampingSearch/CampingDetailFilter';
import { campingLoadRating } from '@services/campingService';
import { useInView } from 'react-intersection-observer';

import { ReactComponent as LocationIcon } from '@assets/icons/current-location.svg';

const geolocationOptions = {
  enableHighAccuracy: true,
  timeout: 1000 * 10,
  maximumAge: 1000 * 3600 * 24,
};

type SelecetedLocType = {
  city: string;
  districts: string[];
};

type FilterCondition = {
  type: 'location' | 'induty' | 'lctCl' | 'sbrsCl' | 'posblFcltyCl' | 'animalCmgCl' | 'facltNm';
  value: string;
};

type DetailFilterType = {
  [key: string]: string[];
};

type Rating = {
  campsiteId: number;
  averageRate: number;
  reviewCount: number;
};

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
  filterCategories.forEach((category) => {
    initialDetailFilters[category.name] = ['전체'];
  });
  const [detailFilters, setDetailFilters] = useState<DetailFilterType>(initialDetailFilters);

  const [inputText, setInputText] = useState('');

  const [campingData, setCampingData] = useState<CampingDataType[]>([]);
  const [filteredData, setFilteredData] = useState<CampingDataType[]>([]);
  const [visibleCount, setVisibleCount] = useState(10); // 처음에 보여줄 camping 개수
  const [selectedCampingData, setSelectedCampingData] = useState<CampingDataType | null>(null);

  const markers = useRef<any[]>([]);

  // 검색 text 필터에 추가
  const setSearchText = () => {
    setFilterCondition((prevConditions) => {
      // 이전의 Location 타입 조건을 제거
      const updatedConditions = prevConditions.filter((condition) => condition.type !== 'facltNm');
      updatedConditions.push({
        type: 'facltNm',
        value: inputText,
      });
      console.log(inputText);
      return updatedConditions;
    });
  };

  // 엔터키 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchText();
    }
  };
  // 검색 버튼 클릭 처리
  const handleSearchClick = () => {
    setSearchText();
  };

  const handleSelect = (city: string, districts: string[]) => {
    setSelectedLocation({ city, districts });
    console.log(city, districts);
  };

  const handleDetailFilterSelect = (filters: DetailFilterType) => {
    setDetailFilters(filters);
    console.log(filters);
  };

  const removeLocationFilter = (filter: string) => {
    if (selectedLocation) {
      const [district] = filter.split(' ');
      if (district) {
        setSelectedLocation((prev) => ({
          ...prev!,
          districts: prev!.districts.filter((d) => d !== district),
        }));
      } else {
        setSelectedLocation(null);
      }
    }
  };

  const removeDetailFilter = (category: string, option: string) => {
    setDetailFilters((prev) => {
      const updatedCategory = prev[category].filter((item) => item !== option);
      if (updatedCategory.length === 0) {
        const { [category]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [category]: updatedCategory };
    });
  };

  // 모달이 오픈될때 Modal을 block시킴
  const modalOpen = (selectedData: CampingDataType) => {
    setSelectedCampingData(selectedData);
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

    loadNaverMap()
      .then((naver) => {
        const mapOptions = {
          center: new window.naver.maps.LatLng(currentLat.current, currentLng.current),
          zoom: 7,
        };
        const mapInstance = new window.naver.maps.Map('map', mapOptions);
        setMap(mapInstance); // map 객체를 상태에 저장
      })
      .catch((error) => {
        console.log(error);
        console.log('Naver map not loaded');
      });

    // 캠핑 데이터 지연로딩
    const loadData = async () => {
      const response = (await import('@utils/campingData.json')) as { default: CampingDataType[] };
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
        currentLat.current = pos.coords.latitude;
        currentLng.current = pos.coords.longitude;
      },
      (error) => {
        console.log(error);
        currentLat.current = 35.9078;
        currentLng.current = 127.7669;
      },
      geolocationOptions,
    );
  };

  // 중심 이동
  const moveMapCenter = (lat: number, lng: number, zoomLevel: number = 15) => {
    if (map) {
      const newCenter = new naver.maps.LatLng(lat, lng);
      map.setCenter(newCenter); // 지도의 중심을 변경
      map.setZoom(zoomLevel);
    }
  };

  const moveMapCurrent = () => {
    setCurrentPos();
    moveMapCenter(currentLat.current, currentLng.current);
  };

  useEffect(() => {
    setFilterCondition((prevConditions) => {
      // 이전의 Location 타입 조건을 제거
      const updatedConditions = prevConditions.filter((condition) => condition.type !== 'location');

      if (selectedLocation === null) return updatedConditions;

      // 새로운 조건 추가
      const { city, districts } = selectedLocation;

      if (city !== '전체') {
        if (districts.includes('전체')) {
          // 시/도만 선택된 경우
          updatedConditions.push({
            type: 'location',
            value: city,
          });
        } else {
          // 특정 구/군들이 선택된 경우
          districts.forEach((district) => {
            updatedConditions.push({
              type: 'location',
              value: `${city} ${district}`,
            });
          });
        }
      }
      console.log(updatedConditions);

      return updatedConditions;
    });
  }, [selectedLocation]);

  useEffect(() => {
    setFilterCondition((prevConditions) => {
      // 이전의 Filter 타입 조건을 제거
      const updatedConditions = prevConditions.filter(
        (condition) => condition.type === 'location' || condition.type === 'facltNm',
      );

      // 새로운 조건 추가
      Object.keys(detailFilters).forEach((key) => {
        let type: 'induty' | 'lctCl' | 'sbrsCl' | 'posblFcltyCl' | 'animalCmgCl';
        if (key === '야영장 타입') {
          type = 'induty';
        } else if (key === '입지구분') {
          type = 'lctCl';
        } else if (key === '부대시설') {
          type = 'sbrsCl';
        } else if (key === '주변시설') {
          type = 'posblFcltyCl';
        } else if (key === '반려동물') {
          type = 'animalCmgCl';
        }
        const values = detailFilters[key];
        // values가 배열이므로 각 값에 대해 조건 추가
        values.forEach((value) => {
          if (value !== '전체') {
            // "전체"가 아닌 경우에만 조건 추가
            updatedConditions.push({
              type: type,
              value: value,
            });
          }
        });
      });

      return updatedConditions;
    });
  }, [detailFilters]);

  // 도시 중심좌표로 이동
  const cityPosMove = () => {
    const locationFilter = filterCondition.find((condition) => condition.type === 'location');

    if (!locationFilter) return null;

    // 도시 이름 추출 (첫 번째 단어)
    const cityName = locationFilter.value.split(' ')[0];

    // koreaAdministrativeDivisions에서 해당 도시 찾기
    const cityData = koreaAdministrativeDivisions.find((city) => city.city === cityName);

    if (!cityData) return null;

    // 도시의 '전체' 지역 좌표 찾기
    const centerCoordinates = cityData.districts.find((district) => district.name === '전체');

    if (!centerCoordinates) return null;

    return { lat: centerCoordinates.lat, lng: centerCoordinates.lng };
  };

  // 필터링 로직
  useEffect(() => {
    const centerCoordinates = cityPosMove();
    if (centerCoordinates !== null) {
      moveMapCenter(centerCoordinates.lat, centerCoordinates.lng, 8);
    }

    const campingListDiv = document.querySelector('#campingList'); // contentBox의 ID로 선택
    if (campingListDiv) {
      campingListDiv.scrollTop = 0; // 스크롤을 최상단으로 이동
    }

    const applyFilters = () => {
      return campingData.filter((camping) => {
        // 조건을 세 가지로 나눕니다: location, facltNm, 그리고 기타 조건들
        const locationConditions = filterCondition.filter(
          (condition) => condition.type === 'location',
        );
        const facltNmConditions = filterCondition.filter(
          (condition) => condition.type === 'facltNm',
        );
        const otherConditions = filterCondition.filter(
          (condition): condition is FilterCondition & { type: keyof CampingDataType } =>
            condition.type !== 'location' && condition.type !== 'facltNm',
        );

        // location 조건 검사
        const locationMatch = locationConditions.some((condition) => {
          const locationParts = condition.value.split(' ');
          const doNm = locationParts[0];
          const sigunguNm = locationParts.length > 1 ? locationParts[1] : null;

          const doNmMatch = camping.doNm ? camping.doNm.includes(doNm) : false;

          if (sigunguNm) {
            const sigunguNmMatch = camping.sigunguNm
              ? camping.sigunguNm.includes(sigunguNm)
              : false;
            return doNmMatch && sigunguNmMatch;
          } else {
            return doNmMatch;
          }
        });

        // location 조건이 있을 경우, 하나라도 맞지 않으면 제외
        if (locationConditions.length > 0 && !locationMatch) {
          return false;
        }

        // facltNm 조건 검사
        const facltNmMatch = facltNmConditions.every((condition) => {
          return camping.facltNm ? camping.facltNm.includes(condition.value) : false;
        });

        // facltNm 조건이 있고, 하나라도 맞지 않으면 제외
        if (facltNmConditions.length > 0 && !facltNmMatch) {
          return false;
        }

        // 기타 조건 검사
        const otherMatch = otherConditions.every((condition) => {
          const campingValue = camping[condition.type];
          return campingValue ? campingValue.split(',').includes(condition.value) : false;
        });

        // 모든 조건이 충족되면 true, 아니면 false
        return otherMatch;
      });
    };

    const filtered = applyFilters();
    const initialIds = filtered
      .slice(0, 10)
      .map((camping) => camping.campsiteId)
      .filter((id): id is number => id !== undefined); // id가 number인 경우만 필터링

    if (filtered.length === 0) {
      setFilteredData([]);
      if (map) {
        markers.current.forEach((marker) => marker.setMap(null));
        markers.current = [];
      }
      return; // 이후 코드 실행을 중지
    }

    // 첫 로드
    const firstLoad = async () => {
      try {
        if (initialIds.length > 0) {
          const response = await campingLoadRating(initialIds);
          const ratingsData: Rating[] = response.data.data; // API 응답에서 데이터 추출 및 타입 지정

          console.log(ratingsData);
          const updatedData = filtered.map((camping) => {
            const ratingInfo = ratingsData.find(
              (rating: Rating) => rating.campsiteId === camping.campsiteId,
            );
            if (camping.campsiteId !== undefined && initialIds.includes(camping.campsiteId)) {
              return {
                ...camping,
                averageRate: ratingInfo ? ratingInfo.averageRate : 0, // 평점이 없으면 0
                reviewCount: ratingInfo ? ratingInfo.reviewCount : 0, // 리뷰 수가 없으면 0
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

    // 마커 생성 및 표시 함수
    const displayFirstMarkers = () => {
      if (map) {
        markers.current.forEach((marker) => marker.setMap(null));
        markers.current = [];

        filtered.slice(0, 10).forEach((campsite) => {
          // X와 Y 좌표가 모두 존재하는 경우에만 마커 생성
          if (typeof campsite.mapX === 'number' && typeof campsite.mapY === 'number') {
            const position = new window.naver.maps.LatLng(campsite.mapY, campsite.mapX);
            const marker = new window.naver.maps.Marker({
              position: position,
              map: map,
              title: campsite.facltNm,
            });

            window.naver.maps.Event.addListener(marker, 'click', () => {
              modalOpen(campsite);
              console.log(`Clicked: ${campsite.facltNm}`);
            });

            markers.current.push(marker);
          } else {
            console.warn(`Missing coordinates for campsite: ${campsite.facltNm}`);
          }
        });
      }
    };

    if (map && filtered.length > 0) {
      displayFirstMarkers();
    }

    firstLoad();
    setVisibleCount(10);
  }, [filterCondition, campingData]);

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
      const response = await campingLoadRating(newIds);
      const ratingsData: Rating[] = response.data.data; // API 응답에서 데이터 추출 및 타입 지정
      // filteredData 업데이트
      console.log(ratingsData);
      setFilteredData((prevData) =>
        prevData.map((camping) => {
          // 캠핑장 ID에 따라 평점 및 리뷰 수 추가
          const ratingInfo = ratingsData.find(
            (rating: Rating) => rating.campsiteId === camping.campsiteId,
          );
          // camping.campsiteId가 정의되어 있고 newIds에 포함되어 있는 경우에만 업데이트
          if (camping.campsiteId !== undefined && newIds.includes(camping.campsiteId)) {
            return {
              ...camping,
              averageRate: ratingInfo ? ratingInfo.averageRate : 0, // 평점이 없으면 0
              reviewCount: ratingInfo ? ratingInfo.reviewCount : 0, // 리뷰 수가 없으면 0
            };
          }

          // 매칭되지 않는 캠핑장은 그대로 반환
          return camping;
        }),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const displayMarkers = (newlyLoadedData: CampingDataType[]) => {
    if (map) {
      // 새로 추가된 데이터에 대해서만 마커 생성
      newlyLoadedData.forEach((campsite) => {
        if (typeof campsite.mapX === 'number' && typeof campsite.mapY === 'number') {
          const position = new window.naver.maps.LatLng(campsite.mapY, campsite.mapX);
          const marker = new window.naver.maps.Marker({
            position: position,
            map: map,
            title: campsite.facltNm,
          });

          window.naver.maps.Event.addListener(marker, 'click', () => {
            modalOpen(campsite);
            console.log(`Clicked: ${campsite.facltNm}`);
          });

          markers.current.push(marker);
        } else {
          console.warn(`Missing coordinates for campsite: ${campsite.facltNm}`);
        }
      });
    }
  };

  useEffect(() => {
    const newlyLoadedData = filteredData.slice(visibleCount - 10, visibleCount);
    if (newlyLoadedData.length > 0) {
      const newIds = newlyLoadedData
        .map((camping) => camping.campsiteId)
        .filter((id): id is number => id !== undefined);
      if (newIds.length > 0) {
        sendLoadRatingRequest(newIds);
      }
      displayMarkers(newlyLoadedData);
    }
  }, [visibleCount]);

  const updateSingleCampingRating = async (campsiteId: number) => {
    try {
      const response = await campingLoadRating([campsiteId]);
      const ratingData: Rating = response.data.data[0]; // 단일 캠핑장 데이터만 가져옴

      setFilteredData((prevData) =>
        prevData.map((camping) => {
          if (camping.campsiteId === campsiteId) {
            return {
              ...camping,
              averageRate: ratingData ? ratingData.averageRate : 0,
              reviewCount: ratingData ? ratingData.reviewCount : 0,
            };
          }
          return camping;
        }),
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const contentBox = document.querySelector('#contentBox') as HTMLElement;
    if (isModalOpen) {
      contentBox.classList.add('md:scrollbar-hide');
      contentBox.classList.add('lg:scrollbar-hide-mo');
    } else {
      contentBox.classList.remove('md:scrollbar-hide');
      contentBox.classList.remove('lg:scrollbar-hide-mo');
    }
  }, [isModalOpen]);

  return (
    <div className={`z-[30]`}>
      {/* 메인 화면 */}
      <div className={`flex flex-col lg:justify-center items-center min-h-screen max-lg:mt-[1rem]`}>
        <h2
          className={`
            max-lg:hidden
            w-[100%] md:max-w-[48rem] lg:max-w-[80rem] font-bold text-4xl mb-[1.8rem]
          `}
        >
          캠핑장 검색
        </h2>
        <div
          className={`
            flex flex-col lg:flex-row w-[100%] md:max-w-[48rem] lg:max-w-[80rem] lg:h-[42rem] p-[0.75rem] mx-[0.5rem]
            bg-light-white bg-opacity-80
            dark:bg-dark-white dark:bg-opacity-80
          `}
        >
          {/* 캠핑지도 */}
          <div className="relative w-full lg:min-w-[400px] lg:max-w-[50rem] lg:h-full aspect-[16/9] lg:aspect-auto">
            <div
              className={`
               z-[0] w-[100%] h-[100%]
              bg-light-black 
              dark:bg-dark-black 
              `}
              id="map"
            />
            <div
              onClick={moveMapCurrent}
              className="
                flex flex-all-center absolute top-2 right-2 z-[0] size-[2.3rem] bg-light-white cursor-pointer rounded-full
              "
            >
              <LocationIcon className="fill-light-black size-[2rem]" />
            </div>
          </div>

          {/* 캠핑장리스트 */}
          <div
            className={`flex flex-col w-full lg:min-w-[470px] lg:h-full lg:ms-[1rem] mt-[0.75rem] lg:mt-0`}
          >
            {/* 검색창 */}
            <div
              className="
                flex justify-between items-center w-full h-fit px-[0.5rem] py-[0.5rem]
                text-light-text bg-light-gray
                dark:text-dark-text dark:bg-dark-gray
                rounded
              "
            >
              <div className="flex items-center w-full">
                <SearchIcon
                  className="
                    shrink-0 size-[1.2rem] md:size-[1.2rem] me-[1rem]
                    stroke-light-border-icon
                    dark:stroke-light-dark-icon
                  "
                />
                <input
                  placeholder="두글자 이상 입력해주세요."
                  className="w-full outline-none bg-transparent"
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                  }}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div
                className="
                  shrink-0 ps-[1.5rem] pe-[0.5rem]
                  text-light-text-secondary
                  dark:text-dark-text-secondary
                  cursor-pointer font-semibold
                "
                onClick={handleSearchClick}
              >
                검색
              </div>
            </div>

            {/* 필터 */}
            <div className="flex space-x-2 mt-[0.75rem]">
              <div
                onClick={() => setIsFilterOpen(true)}
                className="
                  flex items-center w-fit h-fit px-[0.5rem] py-[0.25rem]
                  bg-light-bgbasic dark:bg-dark-bgbasic
                  cursor-pointer rounded
                "
              >
                <div className="me-[0.3rem] font-medium whitespace-nowrap">지역필터</div>
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
                className="
                  flex items-center w-fit h-fit px-[0.5rem] py-[0.25rem]
                  bg-light-bgbasic dark:bg-dark-bgbasic
                  cursor-pointer rounded
                "
              >
                <div className="me-[0.3rem] font-medium whitespace-nowrap">상세필터</div>
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
              {selectedLocation &&
                selectedLocation.city !== '전체' &&
                (selectedLocation.districts.includes('전체') ? (
                  <div className="flex items-center bg-light-gray dark:bg-dark-gray px-2 py-1 rounded-full text-sm">
                    <span>{selectedLocation.city}</span>
                    <button
                      onClick={() => removeLocationFilter(selectedLocation.city)}
                      className="ml-1"
                    >
                      <CloseIcon className="w-4 h-4 fill-light-border-icon dark:fill-dark-border-icon" />
                    </button>
                  </div>
                ) : (
                  selectedLocation.districts.map((district) => (
                    <div
                      key={`${selectedLocation.city} ${district}`}
                      className="flex items-center bg-light-gray dark:bg-dark-gray px-2 py-1 rounded-full text-sm"
                    >
                      <span>{`${selectedLocation.city} ${district}`}</span>
                      <button
                        onClick={() => removeLocationFilter(`${selectedLocation.city} ${district}`)}
                        className="ml-1"
                      >
                        <CloseIcon className="w-4 h-4 fill-light-border-icon dark:fill-dark-border-icon" />
                      </button>
                    </div>
                  ))
                ))}
              {Object.entries(detailFilters).map(([category, options]) =>
                options
                  .filter((option) => option !== '전체') // "전체"가 아닌 옵션만 필터링
                  .map((option) => (
                    <div
                      key={`${category}-${option}`}
                      className="flex items-center bg-light-gray dark:bg-dark-gray px-2 py-1 rounded-full text-sm"
                    >
                      <span>{category === '반려동물' ? `${category}: ${option}` : option}</span>
                      <button onClick={() => removeDetailFilter(category, option)} className="ml-1">
                        <CloseIcon className="w-4 h-4 fill-light-border-icon dark:fill-dark-border-icon" />
                      </button>
                    </div>
                  )),
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
              id="campingList"
            >
              {filteredData.slice(0, visibleCount).map((camping, index) => (
                <Camping key={index} camping={camping} modalOpen={modalOpen} />
              ))}

              <div
                ref={ref}
                className={`${filteredData.length >= 1 ? 'block' : 'hidden'} h-[0.25rem]`}
              ></div>
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
        updateFunction={updateSingleCampingRating}
      />
    </div>
  );
}

export default CampingSearch;
