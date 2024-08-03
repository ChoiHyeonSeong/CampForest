import CampingList from '@components/CampingSearch/CampingList';
import React, { useState, useEffect, useRef } from 'react';

import { ReactComponent as SearchIcon } from '@assets/icons/nav-search.svg';
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg';
import { ReactComponent as FilterIcon } from '@assets/icons/filter2.svg';

import CampingDetail from '@components/CampingSearch/CampingDetail';
import CampingFilter from '@components/CampingSearch/CampingFilter';

const geolocationOptions = {
  enableHighAccuracy: true,
  timeout: 1000 * 10,
  maximumAge: 1000 * 3600 * 24,
}

const koreaAdministrativeDivisions = [
  {
    city: "서울특별시",
    districts: [
      "종로구", "중구", "용산구", "성동구", "광진구", "동대문구", "중랑구", "성북구",
      "강북구", "도봉구", "노원구", "은평구", "서대문구", "마포구", "양천구", "강서구",
      "구로구", "금천구", "영등포구", "동작구", "관악구", "서초구", "강남구", "송파구", "강동구"
    ]
  },
  {
    city: "부산광역시",
    districts: [
      "중구", "서구", "동구", "영도구", "부산진구", "동래구", "남구", "북구",
      "해운대구", "사하구", "금정구", "강서구", "연제구", "수영구", "사상구", "기장군"
    ]
  },
  {
    city: "대구광역시",
    districts: [
      "중구", "동구", "서구", "남구", "북구", "수성구", "달서구", "달성군"
    ]
  },
  {
    city: "인천광역시",
    districts: [
      "중구", "동구", "미추홀구", "연수구", "남동구", "부평구", "계양구", "서구", "강화군", "옹진군"
    ]
  },
  {
    city: "광주광역시",
    districts: [
      "동구", "서구", "남구", "북구", "광산구"
    ]
  },
  {
    city: "대전광역시",
    districts: [
      "동구", "중구", "서구", "유성구", "대덕구"
    ]
  },
  {
    city: "울산광역시",
    districts: [
      "중구", "남구", "동구", "북구", "울주군"
    ]
  },
  {
    city: "세종특별자치시",
    districts: ["세종시"]
  },
  {
    city: "경기도",
    districts: [
      "수원시", "고양시", "용인시", "성남시", "부천시", "화성시", "안산시", "남양주시", "안양시", "평택시",
      "시흥시", "파주시", "의정부시", "김포시", "광주시", "광명시", "군포시", "하남시", "오산시", "양주시",
      "이천시", "구리시", "안성시", "포천시", "의왕시", "여주시", "양평군", "동두천시", "과천시", "가평군", "연천군"
    ]
  },
  {
    city: "강원도",
    districts: [
      "춘천시", "원주시", "강릉시", "동해시", "태백시", "속초시", "삼척시",
      "홍천군", "횡성군", "영월군", "평창군", "정선군", "철원군", "화천군", "양구군", "인제군", "고성군", "양양군"
    ]
  },
  {
    city: "충청북도",
    districts: [
      "청주시", "충주시", "제천시", "보은군", "옥천군", "영동군", "증평군", "진천군", "괴산군", "음성군", "단양군"
    ]
  },
  {
    city: "충청남도",
    districts: [
      "천안시", "공주시", "보령시", "아산시", "서산시", "논산시", "계룡시", "당진시",
      "금산군", "부여군", "서천군", "청양군", "홍성군", "예산군", "태안군"
    ]
  },
  {
    city: "전라북도",
    districts: [
      "전주시", "군산시", "익산시", "정읍시", "남원시", "김제시",
      "완주군", "진안군", "무주군", "장수군", "임실군", "순창군", "고창군", "부안군"
    ]
  },
  {
    city: "전라남도",
    districts: [
      "목포시", "여수시", "순천시", "나주시", "광양시", "담양군", "곡성군", "구례군", "고흥군", "보성군",
      "화순군", "장흥군", "강진군", "해남군", "영암군", "무안군", "함평군", "영광군", "장성군", "완도군", "진도군", "신안군"
    ]
  },
  {
    city: "경상북도",
    districts: [
      "포항시", "경주시", "김천시", "안동시", "구미시", "영주시", "영천시", "상주시", "문경시", "경산시",
      "군위군", "의성군", "청송군", "영양군", "영덕군", "청도군", "고령군", "성주군", "칠곡군", "예천군", "봉화군", "울진군", "울릉군"
    ]
  },
  {
    city: "경상남도",
    districts: [
      "창원시", "진주시", "통영시", "사천시", "김해시", "밀양시", "거제시", "양산시",
      "의령군", "함안군", "창녕군", "고성군", "남해군", "하동군", "산청군", "함양군", "거창군", "합천군"
    ]
  },
  {
    city: "제주특별자치도",
    districts: [
      "제주시", "서귀포시"
    ]
  }
];

function CampingSearch() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalBlocked, setIsModalBlocked] = useState<boolean>(false);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ city: string; district: string } | null>(null);

  const handleSelect = (city: string, district: string) => {
    setSelectedLocation({ city, district });
    console.log(city, district)
  };

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
            <div onClick={() => setIsFilterOpen(true)} className={`flex h-[1.5rem] mx-[1rem]`}>
              <div>필터</div>
              <FilterIcon className={`fill-light-black dark:fill-dark-black`}/>
            </div>
            <CampingFilter 
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              divisions={koreaAdministrativeDivisions}
              onSelect={handleSelect}
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
