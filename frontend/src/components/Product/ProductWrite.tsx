import React, { useState } from 'react';
import Dropdown from './Dropdown';
import { ReactComponent as LocationIcon } from '@assets/icons/location.svg';

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

const ProductWrite = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Option>(categories[0]);
  const buttons = [{label: '대여'}, {label: '판매'}, {label: '나눔'}];

  const handleToggle = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleCategorySelect = (option: Option) => {
    setSelectedCategory(option);
  };

  return (
    <div className='flex justify-center'>
      <div className='w-[40rem]'>
        <form className='mt-[2rem]'>
          {/* 제목, 카테고리 */}
          <div className='flex'>
            <input
              type='text'
              placeholder='제목을 입력하세요.'
              className='w-[31rem] border-b px-[0.5rem] py-[0.25rem] me-[2rem] focus:outline-none' 
            />
            <div className='w-[7rem]'>
            <Dropdown
              label='Write'
              options={categories}
              isOpen={openDropdown === 'categories'}
              onToggle={() => handleToggle('categories')}
              onSelect={handleCategorySelect}
              selectedOption={selectedCategory}
            />
            </div>
          </div>
          {/* 상품 사진 */}
          <div className='w-[7.5rem] aspect-1 border my-[1.5rem]'>

          </div>
          {/* 상품 설명 */}
          <div className='mb-[1.5rem]'>
            <div className='mb-[0.25rem] font-medium'>상품 설명</div>
            <textarea 
             className='resize-none border border-[#999999] min-h-[10rem] w-full focus:outline-none p-[1rem]'
             placeholder='사기치면 손모가지 날아갑니다.&#13;&#10;귀찮은데잉' />
          </div>
          {/* 거래 유형 */}
          <div className='mb-[1.5rem]'>
            <div className='my-[0.25rem] font-medium'>거래 유형</div>
            <div className='flex'>
              {buttons.map((button) => (
                <div className='border me-[1rem] px-[2rem] py-[0.15rem] cursor-pointer'>{button.label}</div>
              ))}
            </div>
          </div>
          {/* 금액, 보증금 */}
          <div className='grid grid-cols-2 gap-[3rem] mb-[2rem]'>
            <div>
              <div className='my-[0.25rem] font-medium'>금액</div>
              <div className='flex'>
                <input 
                  className='w-[90%] px-[0.5rem] border-b me-[0.75rem] focus:outline-none' 
                />
                <div>원</div>
              </div>
            </div>
            <div>
              <div className='my-[0.25rem] font-medium'>보증금</div>
              <div className='flex'>
                <input 
                  className='w-[90%] px-[0.5rem] border-b me-[0.75rem] focus:outline-none' 
                />
                <div>원</div>
              </div>
            </div>
          </div>
          {/* 거래 희망 장소 */}
          <div className='mb-[5em]'>
            <div className='my-[0.25rem] font-medium'>거래 희망 장소</div>
            <div className='flex border px-[0.5rem] py-[0.25rem] w-1/2'>
              <LocationIcon fill='333333' className='me-[0.5rem]'/>
              <div className='text-[#999999]'>
                위치를 선택하세요.
              </div>
            </div>
          </div>
          <div className='text-end'>
            <button className='w-1/2 text-center bg-black text-white py-[0.35rem]'>작성 완료</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductWrite;