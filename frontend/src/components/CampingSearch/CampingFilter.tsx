import React, { useState } from 'react';

type Districts = {
  name: string;
  lat: number;
  lng: number;
}

type AdministrativeDivision = {
  city: string;
  districts: Districts[];
}

type SelecetedLocType = {
  city: string; 
  district: string
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  divisions: AdministrativeDivision[];
  onSelect: (city: string, district: string, lat: number, lng: number) => void;
  selectedLocation: SelecetedLocType | null;
}

const CampingFilter = (props: Props) => {
  const [selectedCity, setSelectedCity] = useState<string>('전체');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('전체');

  const [selectedLat, setSelectedLat] = useState(35.9078)
  const [selectedLng, setSelectedLng] = useState(127.7669)

  if (!props.isOpen) return null;

  const closeFilter = () => {
    if (props.selectedLocation !== null) {
      setSelectedCity(props.selectedLocation.city)
      setSelectedDistrict(props.selectedLocation.district)
    }
    props.onClose()
  }

  return (
    <div 
      className="
        flex flex-all-center fixed inset-0 
        bg-light-black bg-opacity-80
        dark:bg-dark-black dark:bg-opacity-80
      "
    >
      <div 
        className="flex flex-col w-[100%] max-w-[48rem] p-[1.5rem] 
          bg-light-white
          dark:bg-dark-white
          rounded-lg
        "
      >
        <h2 className="mb-[1rem] text-xl font-bold">지역 선택</h2>
        <div className="flex">
          <div className="w-[50%] pr-[0.5rem]">
            <h3 className="mb-[0.5rem] font-semibold">시/도</h3>
            <div className="grid grid-cols-3 gap-2">
              {props.divisions.map((division) => (
                <button
                  key={division.city}
                  className={`
                    ${selectedCity === division.city ? 'bg-light-black dark:bg-dark-black text-light-white dark:text-dark-white' : 'bg-light-gray dark:bg-dark-gray'}
                    p-[0.5rem]
                    rounded text-sm
                  `}
                  onClick={() => {
                    setSelectedDistrict(division.districts[0].name);
                    setSelectedLat(division.districts[0].lat);
                    setSelectedLng(division.districts[0].lng);
                    setSelectedCity(division.city);
                  }}
                >
                  {division.city}
                </button>
              ))}
            </div>
          </div>
          
          <div className="w-[50%] pl-[0.5rem]">
            <h3 className="font-semibold mb-2">구/군</h3>
            <div className="grid grid-cols-3 gap-2">
              {selectedCity &&
                props.divisions
                  .find((division) => division.city === selectedCity)
                  ?.districts.map((district) => (
                    <button
                      key={district.name}
                      className={`
                        ${selectedDistrict === district.name ? 'bg-light-black dark:bg-dark-black text-light-white dark:text-dark-white' : 'bg-light-gray dark:bg-dark-gray'}
                        p-[0.5rem]
                        rounded text-sm
                      `}
                      onClick={() => {
                        setSelectedDistrict(district.name);
                        setSelectedLat(district.lat);
                        setSelectedLng(district.lng);
                      }}
                    >
                      {district.name}
                    </button>
                  ))}
            </div>
          </div>
          
        </div>
        <div className='flex justify-between'>
          <button
            onClick={closeFilter}
            className="
              mt-[1rem] px-[1rem] py-[0.5rem] 
              bg-light-signature text-light-white hover:bg-light-signature-hover
              dark:bg-dark-signature dark:text-dark-white dark:hover:bg-dark-signature-hover
              rounded
            "
          >
            닫기
          </button>
          
          <button
            onClick={() => {
              props.onSelect(selectedCity, selectedDistrict, selectedLat, selectedLng);
              props.onClose();
            }}
            className={`
              mt-[1rem] px-[1rem] py-[0.5rem] 
              bg-light-signature text-light-white hover:bg-light-signature-hover 
              dark:bg-dark-signature dark:text-dark-white dark:hover:bg-dark-signature-hover
              rounded
            `}
          >
            확인
          </button>
        </div> 
      </div>
    </div>
  );
};

export default CampingFilter;