import React, { useState } from 'react';

// Component
import ProductCard from './ProductCard';
import ProductCard2 from './ProductCard2';
import Dropdown from './Dropdown';

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

const ProductList = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isAccBtnActive, setIsAccBtnActive] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(1);

  // 각 Dropdown에 대한 상태 추가
  const [selectedCategory, setSelectedCategory] = useState<Option>(categories[0]);
  const [selectedPrice, setSelectedPrice] = useState<Option>(prices[0]);
  const [selectedLocation, setSelectedLocation] = useState<Option>(locations[0]);

  const handleToggle = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleAccBtnClick = () => {
    setIsAccBtnActive(!isAccBtnActive);
  };

  const handleTabClick = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  // 각 Dropdown의 선택을 처리하는 함수들
  const handleCategorySelect = (option: Option) => {
    setSelectedCategory(option);
  };

  const handlePriceSelect = (option: Option) => {
    setSelectedPrice(option);
  };

  const handleLocationSelect = (option: Option) => {
    setSelectedLocation(option);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="p-6 w-full lg:w-[60rem] xl:w-[66rem] lg:p-0">
        <div className="md:flex justify-between mt-6 mb-10 hidden items-center">
          <h3 className="font-medium md:text-2xl lg:text-3xl">상품 판매/대여</h3>
          <div className="cursor-pointer px-2 py-1 bg-[#FF7F50] text-white rounded-sm text-sm">
            작성하기
          </div>
        </div>

        <div className="w-full flex mb-10 h-12">
          <div
            onClick={() => handleTabClick(1)}
            className={`w-1/2 cursor-pointer flex items-center md:text-lg font-medium text-center border-b-2 transition-all duration-200 ${
              activeTab === 1 ? 'border-[#FF7F50]' : 'border-[#eee]'
            }`}
          >
            <div className="w-full text-center">판매</div>
          </div>
          <div
            onClick={() => handleTabClick(2)}
            className={`w-1/2 cursor-pointer flex items-center md:text-lg font-medium text-center border-b-2 transition-all duration-200 ${
              activeTab === 2 ? ' border-[#FF7F50]' : 'border-[#eee]'
            }`}
          >
            <div className="w-full text-center">대여</div>
          </div>
        </div>

        <div className="mb-3 flex gap-2 items-center relative z-10 flex-wrap ps-3">
          <Dropdown
            label="카테고리"
            options={categories}
            isOpen={openDropdown === 'categories'}
            onToggle={() => handleToggle('categories')}
            onSelect={handleCategorySelect}
            selectedOption={selectedCategory}
          />
          <Dropdown
            label="가격"
            options={prices}
            isOpen={openDropdown === 'prices'}
            onToggle={() => handleToggle('prices')}
            onSelect={handlePriceSelect}
            selectedOption={selectedPrice}
          />
          <Dropdown
            label="지역"
            options={locations}
            isOpen={openDropdown === 'locations'}
            onToggle={() => handleToggle('locations')}
            onSelect={handleLocationSelect}
            selectedOption={selectedLocation}
          />
          <div
            className={`acc-btn duration-200 cursor-pointer rounded-md border shadow-sm px-4 py-2 text-sm font-medium focus:outline-none ${
              isAccBtnActive
                ? 'bg-[#FF7F50] text-white border-[#FF7F50]'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            onClick={handleAccBtnClick}
          >
            <p>거래 가능</p>
          </div>
        </div>
        <div className="w-full flex flex-wrap">
          <ProductCard />
          <ProductCard2 />
          <ProductCard />
          <ProductCard />
          <ProductCard2 />
          <ProductCard2 />
          <ProductCard />
          <ProductCard />
        </div>
      </div>
    </div>
  );
};

export default ProductList;