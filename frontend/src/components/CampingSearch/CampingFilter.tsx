import React, { useState } from 'react';

type AdministrativeDivision = {
  city: string;
  districts: string[];
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  divisions: AdministrativeDivision[];
  onSelect: (city: string, district: string) => void;
}

const CampingFilter = (props: Props) => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  if (!props.isOpen) return null;

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
                    setSelectedDistrict(null);
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
                      key={district}
                      className={`
                        ${selectedDistrict === district ? 'bg-light-black dark:bg-dark-black text-light-white dark:text-dark-white' : 'bg-light-gray dark:bg-dark-gray'}
                        p-[0.5rem]
                        rounded text-sm
                      `}
                      onClick={() => setSelectedDistrict(district)}
                    >
                      {district}
                    </button>
                  ))}
            </div>
          </div>
          
        </div>
        <div className='flex justify-between'>
          <button
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={props.onClose}
          >
            닫기
          </button>
          
          <button
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => {
              props.onSelect(`${selectedCity ? selectedCity : ''}`, `${selectedDistrict ? selectedDistrict : ''}`);
              props.onClose();
            }}
          >
            확인
          </button>
        </div> 
      </div>
    </div>
  );
};

export default CampingFilter;