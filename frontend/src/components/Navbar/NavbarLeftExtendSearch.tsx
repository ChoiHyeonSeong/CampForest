import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as LeftArrow } from '@assets/icons/arrow-left.svg'
import { ReactComponent as SearchIcon } from '@assets/icons/nav-search.svg'
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg'

import eventEmitter from '@utils/eventEmitter';

import Swal from 'sweetalert2'

type Props = {
  isExtendMenuOpen: boolean;
  toggleExtendMenu: (param:string) => void;
  closeMenu: () => void;
}

const NavbarLeftExtendSearch = (props: Props) => {
  const [searchText, setSearchText] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const navigate = useNavigate();

  const loadRecentSearches = () => {
    const storedSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(storedSearches);
  };

  const errorAlert = (message: string) => {
    Swal.fire({
      text: message,
      icon: "error"
    });
  }
  
  useEffect(() => {
    loadRecentSearches();
  
    const handleRecentSearchesUpdate = () => {
      loadRecentSearches();
    };

    eventEmitter.on('recentSearchesUpdated', handleRecentSearchesUpdate);

    // 이벤트 리스너 추가
    window.addEventListener('recentSearchesUpdated', loadRecentSearches);
  
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('recentSearchesUpdated', loadRecentSearches);

      eventEmitter.off('recentSearchesUpdated', handleRecentSearchesUpdate);
    };
  }, []);

  const addRecentSearch = (search: string) => {
    const updatedSearches = [search, ...recentSearches.filter(s => s !== search)].slice(0, 10);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const removeRecentSearch = (search: string) => {
    const updatedSearches = recentSearches.filter(s => s !== search);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSearch = (text: string = searchText) => {
    if (text.length >= 2) {
      addRecentSearch(text);
      navigate(`/search?query=${encodeURIComponent(text)}`);
      props.closeMenu();
    } else {
      errorAlert('검색어는 두 글자 이상 입력해야 합니다.');
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
          flex justify-between items-center w-full h-[2.8rem] md:h-[3.1rem] mb-[1.75rem] px-[0.5rem]
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
              data-testid="searchuser-2"
            />
        </div>
        <div
          className='
            shrink-0 ps-[1.5rem] pe-[0.5rem]
            text-light-text-secondary
            dark:text-dark-text-secondary
            cursor-pointer font-semibold text-[0.92rem]
          '
          onClick={() => handleSearch()}
          data-testid="searchuser-3"
        >
          검색
        </div>
      </div>

      {/* 최근검색어 띄우기 */}
      <div className='w-full px-[0.25rem]'>
        <p className='font-medium'>최근 검색어</p>
        <div className='recentsearch-tag mt-[0.5rem] flex flex-wrap gap-2'>
          {recentSearches.map((search, index) => (
            <button 
              key={index} 
              className='flex items-center bg-light-gray dark:bg-dark-gray rounded-full px-[0.75rem] py-[0.2rem]'
              onClick={() => handleSearch(search)}
            >
              <p>{search}</p>
              <CloseIcon 
                className='size-[1rem] ms-[0.25rem] fill-light-border-icon dark:fill-dark-border-icon cursor-pointer' 
                onClick={(e) => {
                  e.stopPropagation();
                  removeRecentSearch(search);
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NavbarLeftExtendSearch;