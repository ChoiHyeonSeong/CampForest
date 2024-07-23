import React from 'react'
import { useState } from 'react';
import ProductList from '@components/Transaction/ProductList';
import Dropdown from '@components/Transaction/Dropdown';


type Option = {
  id: number;
  name: string;
};

const categories: Option[] = [
  { id: 1, name: '분류 전체' },
  { id: 2, name: '텐트' },
  { id: 3, name: '의자' },
  { id: 4, name: '침낭/매트' },
  { id: 5, name: '테이블' },
  { id: 6, name: '랜턴' },
  { id: 7, name: '코펠/식기' },
  { id: 8, name: '안전용품' },
  { id: 9, name: '버너/화로' },
  { id: 10, name: '기타' },
];

const prices: Option[] = [
  { id: 1, name: '가격 전체' },
  { id: 2, name: '₩0 - ₩10,000이하' },
  { id: 3, name: '₩10,000 - ₩50,000' },
  { id: 4, name: '₩500,000 - ₩100,000' },
  { id: 5, name: '₩100,000 이상' },
];

const locations: Option[] = [
  { id: 1, name: '지역 전체' },
  { id: 2, name: '수도권' },
  { id: 4, name: '강원' },
  { id: 5, name: '충청' },
  { id: 6, name: '전라' },
  { id: 7, name: '경상' },
  { id: 8, name: '제주' },
];



function Trade() {

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleToggle = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  return (
    <div className='flex justify-center items-center'>
      <div className='p-6 w-full lg:w-[48rem] xl:w-[55rem] lg:p-0'>

        {/* 페이지명 - 모바일에서는 네브바에 표시됨 */}
        <h3 className='my-6 hidden md:block font-medium md:text-2xl lg:text-3xl'>상품 판매/대여</h3>


        {/* 카테고리별 정렬 */}
        <div className="mb-6 flex gap-2 items-center relative z-10 flex-wrap">
        <Dropdown
          label="카테고리"
          options={categories}
          isOpen={openDropdown === 'categories'}
          onToggle={() => handleToggle('categories')}
        />
        <Dropdown
          label="가격"
          options={prices}
          isOpen={openDropdown === 'prices'}
          onToggle={() => handleToggle('prices')}
        />
        <Dropdown
          label="지역"
          options={locations}
          isOpen={openDropdown === 'locations'}
          onToggle={() => handleToggle('locations')}
        />
          <div className='duration-200 hover:bg-[#FF7F50] cursor-pointer bg-[#ccc] rounded-md text-white px-4 py-2 text-sm font-medium'>
            <p>거래상태</p>
            {/* text-gray-700 block px-4 py-1 text-sm */}
          </div>
        </div>


        {/* 거래상품 목록 */}
        <ProductList />
          

      </div>
    </div>
  )
}

export default Trade