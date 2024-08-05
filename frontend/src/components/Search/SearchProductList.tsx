import React, { useState } from 'react';
import SearchProduct from '@components/Search/SearchProduct'

type Props = {}

const SearchProductList = (props: Props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('전체');

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    setIsDropdownOpen(false); // 메뉴 선택 후 드롭다운 닫기
  };


  return (
    <div>
      <div className='flex justify-between items-center'>
        <div className='flex items-center'>
          <p className='font-medium text-lg md:text-xl'>장비거래<span className='ms-[0.5rem] font-bold'>79</span></p>
          <p className='
            ms-[1rem]
            text-light-text-secondary
            dark:text-dark-text-secondary
            '
          >
            <span
              className='
                me-[0.25rem]
                text-light-signature
                dark:text-dark-signature
                font-semibold 
              '
            >
              {selectedFilter}
            </span>
            검색결과
          </p>
        </div>
       
        {/* 드롭다운 필터 */}
        <div className='relative'>
          {/* 드롭다운 버튼 */}
          <button 
            onClick={toggleDropdown}
            className='
              relative px-[0.8rem] py-[0.2rem] 
              bg-light-signature text-light-white 
              dark:bg-dark-signature
              rounded-sm cursor-pointer
            '
          >
            필터
          </button>

          {/* 드롭다운 메뉴 */}
          {isDropdownOpen && (
            <div
              className='
                absolute z-10 right-0 w-[5rem] mt-[0.5rem]
                bg-light-white
                dark:bg-dark-white
                shadow-lg rounded-md font-medium overflow-hidden'
            >
              <div className='py-[0.5rem]'>
                <button
                  className='
                    block w-full ps-[1rem] py-[0.5rem]
                    text-light-text-secondary hover:text-light-signature
                    text-left cursor-pointer
                  '
                  onClick={() => handleFilterChange('전체')}
                >
                  전체
                </button>
                <button
                  className='
                    block w-full ps-[1rem] py-[0.5rem]
                    text-light-text-secondary hover:text-light-signature
                    text-left cursor-pointer
                  '
                  onClick={() => handleFilterChange('판매')}
                >
                  판매
                </button>
                <button
                  className='
                    block w-full ps-[1rem] py-[0.5rem]
                    text-light-text-secondary hover:text-light-signature
                    text-left cursor-pointer
                  '
                  onClick={() => handleFilterChange('대여')}
                >
                  대여
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <SearchProduct />
    </div>
  )
}

export default SearchProductList