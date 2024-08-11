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
  districts: string[]
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  divisions: AdministrativeDivision[];
  onSelect: (city: string, district: string[]) => void;
  selectedLocation: SelecetedLocType | null;
}

const LocationFilter = (props: Props) => {
  const [selectedCity, setSelectedCity] = useState<string>('전체');
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>(['전체']);

  if (!props.isOpen) return null;

  const closeFilter = () => {
    if (props.selectedLocation !== null)  {
      setSelectedCity(props.selectedLocation.city)
      setSelectedDistricts(props.selectedLocation.districts)
    }
    props.onClose()
  }

  const handleDistrictSelection = (districtName: string) => {
    if (districtName === '전체') {
      setSelectedDistricts(['전체']);
    } else {
      setSelectedDistricts(prev => {
        const newSelection = prev.includes(districtName)
          ? prev.filter(d => d !== districtName)
          : [...prev.filter(d => d !== '전체'), districtName];
        
        return newSelection.length === 0 ? ['전체'] : newSelection;
      });
    }
  };

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
                    if (selectedCity !== division.city) {
                      setSelectedDistricts(['전체']);
                      setSelectedCity(division.city);
                    }
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
                        ${selectedDistricts.includes(district.name) ? 'bg-light-black dark:bg-dark-black text-light-white dark:text-dark-white' : 'bg-light-gray dark:bg-dark-gray'}
                        p-[0.5rem]
                        rounded text-sm
                      `}
                      onClick={() => {
                        handleDistrictSelection(district.name);
                      }}
                    >
                      {district.name}
                    </button>
                  ))}
            </div>
          </div>
          
        </div>
        <div className='flex justify-center mt-[0.5rem]'>
          {/* <button
            onClick={closeFilter}
            className="
              mt-[1rem] px-[1rem] py-[0.5rem] 
              bg-light-signature text-light-white hover:bg-light-signature-hover
              dark:bg-dark-signature dark:text-dark-white dark:hover:bg-dark-signature-hover
              rounded
            "
          >
            닫기
          </button> */}
          
          <button
            onClick={() => {
              props.onSelect(selectedCity, selectedDistricts);
              props.onClose();
            }}
            className={`
              w-1/2 mt-[1rem] px-[1rem] py-[0.5rem] 
              bg-light-signature text-light-white hover:bg-light-signature-hover 
              dark:bg-dark-signature dark:text-dark-white dark:hover:bg-dark-signature-hover
              rounded
            `}
          >
            선택 완료
          </button>
        </div> 
      </div>
    </div>
  );
};

export default LocationFilter;