import React, { useState, useEffect } from 'react';
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg';

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

  useEffect(() => {
    if (props.selectedLocation) {
      setSelectedCity(props.selectedLocation.city);
      setSelectedDistricts(props.selectedLocation.districts);
    }
  }, [props.selectedLocation]);

  if (!props.isOpen) return null;

  const closeFilter = () => {
    if (props.selectedLocation) {
      setSelectedCity(props.selectedLocation.city);
      setSelectedDistricts(props.selectedLocation.districts);
    }
    props.onClose();
  };

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

  const resetFilters = () => {
    setSelectedCity('전체');
    setSelectedDistricts(['전체']);
  };

  return (
    <div
      onClick={closeFilter}
      className="
        flex flex-all-center fixed inset-0 
        bg-black bg-opacity-80
      "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          flex flex-col w-[90%] md:w-[45rem] max-h-[75vh] p-6
          bg-light-white
          dark:bg-dark-white
          rounded-lg overflow-y-auto
        "
      >
        <div className='flex justify-between mb-[1rem]'>
          <h2 className="text-xl font-bold">지역 필터</h2>
          <CloseIcon
            onClick={closeFilter}
            className='
              size-[1.5rem]
              fill-light-border-icon
              dark:fill-dark-border-icon
              cursor-pointer
            '
          />
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-[50%] md:pr-[0.5rem]">
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
          
          <div className="w-full md:w-[50%] mt-[1rem] md:mt-0 md:pl-[0.5rem]">
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
        <div className='flex justify-center mt-[1.75rem]'>
        <button
          onClick={resetFilters}
          className="
            w-1/2 py-[0.5rem] me-[0.75rem]
            bg-light-gray-1 text-light-text hover:bg-light-gray-2
            dark:bg-dark-gray-1 dark:text-dark-text dark:hover:bg-dark-gray-2
            rounded transition-all duration-150
          "
          >
            필터 초기화
          </button>
          <button
            onClick={() => {
              props.onSelect(selectedCity, selectedDistricts);
              props.onClose();
            }}
            className={`
              w-1/2 py-[0.5rem] me-[0.75rem]
              bg-light-signature text-light-white hover:bg-light-signature-hover 
              dark:bg-dark-signature dark:hover:bg-dark-signature-hover
              rounded transition-all duration-150
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