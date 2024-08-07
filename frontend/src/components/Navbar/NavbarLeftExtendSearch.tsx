import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as LeftArrow } from '@assets/icons/arrow-left.svg'
import { ReactComponent as SearchIcon } from '@assets/icons/nav-search.svg'

type Props = {
  isExtendMenuOpen: boolean;
  toggleExtendMenu: (param:string) => void;
  closeMenu: () => void;
}

const NavbarLeftExtendSearch = (props: Props) => {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSearch = () => {
    if (searchText.length >= 2) {
      navigate(`/search?query=${encodeURIComponent(searchText)}`);
      props.closeMenu()
    } else {
      alert('검색어는 두 글자 이상 입력해야 합니다.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div
      className={`
        ${props.isExtendMenuOpen ? 'translate-x-[5rem]' : '-translate-x-full'}
        fixed z-[35] w-[20rem] h-[100%] pt-[3.2rem] lg:pt-[0] px-[0.75rem]
        bg-light-white border-light-border-1
        dark:bg-dark-white dark:border-dark-border-1
        border-r transition-all duration-300 ease-in-out
      `}
    >
      <div className={`flex items-center h-[5rem]`}>
        <LeftArrow 
          onClick={() => props.toggleExtendMenu('search')}
          className={`
            w-[1.25rem] h-[1.25rem] me-[0.75rem] 
            fill-light-black
            dark:fill-dark-black
            cursor-pointer
          `}
        />
        <p className={`text-2xl`}>검색</p>
      </div>

      {/* 검색창  */}
      <div
        className='
          flex justify-between items-center w-full h-[2.8rem] md:h-[3.1rem] mb-[0.5rem] px-[0.5rem]
          text-light-text bg-light-gray
          dark:text-dark-text dark:bg-dark-gray
          font-medium text-lg rounded
          '
        >
        <div className='flex items-center w-full'>
          <SearchIcon
            className='
              shrink-0 size-[1.4rem] md:size-[1.2rem] me-[0.5rem]
              stroke-light-border-icon
              dark:stroke-dark-border-icon
            '
          />
          <input
              placeholder='두글자 이상 입력해주세요.'
              className='w-full outline-none bg-transparent text-[0.92rem]'
              value={searchText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
        </div>
        <div
          className='
            shrink-0 ps-[1.5rem] pe-[0.5rem]
            text-light-text-secondary
            dark:text-dark-text-secondary
            cursor-pointer font-semibold text-[0.92rem]
          '
          onClick={handleSearch}
        >
          검색
        </div>
      </div>
    </div>
  )
}

export default NavbarLeftExtendSearch;