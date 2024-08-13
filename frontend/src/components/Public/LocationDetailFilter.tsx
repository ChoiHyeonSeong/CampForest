import React, { useState, useEffect } from 'react';

import { ReactComponent as CloseIcon } from '@assets/icons/close.svg' 
import geoData from '@utils/geoData.json'

type Town = string;

type District = {
  name: string;
  town: Town[];
}

type SelectedLocType = {
  city: string;
  district: string;
  town: string[];
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selected: SelectedLocType) => void;
  selectedLocation: SelectedLocType | null;
}

const LocationFilter = (props: Props) => {
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedTowns, setSelectedTowns] = useState<string[]>([]);

  useEffect(() => {
    if (props.selectedLocation === null) {
      setSelectedCity('');
      setSelectedDistrict('');
      setSelectedTowns([]);
    } else if (props.selectedLocation) {
      setSelectedCity(props.selectedLocation.city);
      setSelectedDistrict(props.selectedLocation.district);
      setSelectedTowns(props.selectedLocation.town);
    }
  }, [props.selectedLocation]);

  if (!props.isOpen) return null;

  const handleCitySelection = (city: string) => {
    setSelectedCity(city);
    setSelectedDistrict('');
    setSelectedTowns([]);
  };

  const handleDistrictSelection = (district: string) => {
    setSelectedDistrict(district);
    setSelectedTowns([]);
  };

  const handleTownSelection = (town: string) => {
    setSelectedTowns(prev => {
      if (prev.includes(town)) {
        return prev.filter(t => t !== town);
      } else {
        return [...prev, town];
      }
    });
  };

  return (
    <div 
      onClick={props.onClose}
      className="flex flex-all-center fixed inset-0 bg-light-black bg-opacity-80"
    >
      <div 
        onClick={e => e.stopPropagation()}
        className="flex flex-col w-[100%] max-w-[54rem] p-[1.5rem] bg-light-white dark:bg-dark-white rounded-lg max-md:h-[calc(100vh-6.4rem)] max-md:overflow-y-auto"
      >
        <div className='flex justify-between max-md:h-[10%]'>
          <h2 className="mb-[1rem] text-xl font-bold">지역 선택</h2>
          <CloseIcon 
            onClick={props.onClose} 
            className={`
              size-[1.5rem]
              fill-light-border-icon
              dark:fill-dark-border-icon
              cursor-pointer
            `}
          />
        </div>

        <div className="flex flex-wrap md:h-[30rem] md:mb-[3rem] max-md:h-[82%] overflow-y-auto">
          
          <div className="w-full md:w-[30%] pr-[0.5rem] mb-4">
            <h3 className="mb-[0.5rem] font-semibold">시/도</h3>
            <div className="grid grid-cols-3 gap-2">
              {geoData.map((division, index) => (
                <button
                  key={index}
                  className={`${selectedCity === division.city ? 'bg-light-black dark:bg-dark-black text-light-white dark:text-dark-white' : 'bg-light-gray dark:bg-dark-gray'} p-[0.5rem] rounded text-sm`}
                  onClick={() => handleCitySelection(division.city)}
                >
                  {division.city}
                </button>
              ))}
            </div>
          </div>
          
          <div className="w-full md:w-[40%] px-[0.5rem] mb-4">
            {selectedCity && (
              <>
                <h3 className="font-semibold mb-2">구/군</h3>
                <div className="grid grid-cols-2 gap-2 max-h-[30rem] overflow-y-auto">
                  {geoData.find(d => d.city === selectedCity)?.districts.map((district, index) => (
                    <button
                      key={index}
                      className={`${selectedDistrict === district.name ? 'bg-light-black dark:bg-dark-black text-light-white dark:text-dark-white' : 'bg-light-gray dark:bg-dark-gray'} p-[0.5rem] rounded text-sm`}
                      onClick={() => handleDistrictSelection(district.name)}
                    >
                      {district.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {selectedDistrict && (
            <div className="w-full md:w-[30%] pl-[0.5rem] mb-4">
              <h3 className="font-semibold mb-2">읍/면/동</h3>
              <div className="grid grid-cols-2 gap-2 max-h-[30rem] overflow-y-auto">
                {geoData.find(d => d.city === selectedCity)?.districts.find(d => d.name === selectedDistrict)?.town.map((town, index) => (
                  <button
                    key={index}
                    className={`${selectedTowns.includes(town) ? 'bg-light-black dark:bg-dark-black text-light-white dark:text-dark-white' : 'bg-light-gray dark:bg-dark-gray'} p-[0.5rem] rounded text-sm`}
                    onClick={() => handleTownSelection(town)}
                  >
                    {town}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className='flex justify-center mt-[0.5rem] max-md:h-[8%]'>
          <button
            onClick={() => {
              props.onSelect({
                city: selectedCity,
                district: selectedDistrict,
                town: selectedTowns
              });
              props.onClose();
            }}
            className="w-1/2 mt-[1rem] px-[1rem] py-[0.5rem] bg-light-signature text-light-white hover:bg-light-signature-hover dark:bg-dark-signature dark:text-dark-white dark:hover:bg-dark-signature-hover rounded"
          >
            선택 완료
          </button>
        </div> 
      </div>
    </div>
  );
};

export default LocationFilter;