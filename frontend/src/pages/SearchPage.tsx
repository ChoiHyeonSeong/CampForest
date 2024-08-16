import React, { useState, useEffect, useCallback } from 'react';
import { ReactComponent as SearchIcon } from '@assets/icons/nav-search.svg'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import SearchProfileList from '@components/Search/SearchProfileList'
import SearchBoardList from '@components/Search/SearchBoardList'
import SearchProductList from '@components/Search/SearchProductList'
import SearchAllList from '@components/Search/SearchAllList';

import eventEmitter from '@utils/eventEmitter';

import Swal from 'sweetalert2'
import PageNotFound from './PageNotFound';

const SearchPage = () => {
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('/');
  const [searchKey, setSearchKey] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // 최근 검색어 목록 관리
  const addRecentSearch = useCallback((search: string) => {
    const storedSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const updatedSearches = [search, ...storedSearches.filter((s: string) => s !== search)].slice(0, 10);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));

    eventEmitter.emit('recentSearchesUpdated', updatedSearches);
  }, []);

  const errorAlert = (message: string) => {
    Swal.fire({
      text: message,
      icon: "error"
    });
  }

  // 검색 실행 함수
  const executeSearch = useCallback((path: string = '') => {
    if (inputText.length < 2) {
      errorAlert('검색어는 두 글자 이상 입력해야 합니다.');
      return;
    }
    setSearchQuery(inputText);
    addRecentSearch(inputText);
    setSearchKey(prevKey => prevKey + 1);
    navigate(`/search${path}?query=${encodeURIComponent(inputText)}`);
  }, [inputText, navigate, addRecentSearch]);

  // 현재 경로에 따른 검색 경로 결정
  const getSearchPath = useCallback(() => {
    const currentPath = location.pathname;
    if (currentPath.includes('/search/profile')) return '/profile';
    if (currentPath.includes('/search/board')) return '/board';
    if (currentPath.includes('/search/product')) return '/product';
    return '';
  }, [location.pathname]);

  // 엔터키 검색 처리
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 기본 동작을 막음
      e.stopPropagation(); // 이벤트 전파를 막음
      executeSearch(getSearchPath());
    }
  }, [executeSearch, getSearchPath]);

  // 검색 버튼 클릭 처리
  const handleSearchClick = useCallback(() => {
    executeSearch(location.pathname.replace('/search', ''));
  }, [executeSearch, location.pathname]);

  // 탭 클릭 처리
  const handleTabClick = useCallback((path: string) => {
    setActiveTab(path);
    navigate(`/search${path}?query=${encodeURIComponent(searchQuery)}`);
  }, [navigate, searchQuery]);

  // 입력값 변경 처리
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  }, []);

  // 탭 클래스 이름 설정
  const getTabClassName = useCallback((path: string) => {
    return activeTab === path
      ? `flex flex-all-center px-[0.5rem] md:px-[1.5rem] h-full border-light-signature text-light-text dark:text-dark-text font-semibold border-b-2 cursor-pointer`
      : `flex flex-all-center px-[0.5rem] md:px-[1.5rem] h-full hover:border-light-signature hover:text-light-text dark:hover:text-dark-text hover:font-semibold hover:border-b-2 cursor-pointer`;
  }, [activeTab]);

  // 초기 상태 설정
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('query') || '';
    setInputText(query);
    setSearchQuery(query);
    const path = location.pathname.replace('/search', '') || '/';
    setActiveTab(path);
    setSearchKey(prevKey => prevKey + 1);
  }, [location.search, location.pathname]);


  return (
    <div
      className='
        flex justify-center w-full min-h-screen
        bg-light-white
        dark:bg-dark-white
      '
    >
      <div className='w-full lg:w-[65%] lg:min-w-[56rem] max-lg:p-[1.5rem] lg:py-[2.5rem]'>
        
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
                shrink-0 size-[1.4rem] md:size-[1.6rem] me-[1rem]
                stroke-light-border-icon
                dark:stroke-light-dark-icon
              '
            />
            <input
                placeholder='두글자 이상 입력해주세요.'
                className='w-full outline-none bg-transparent'
                value={inputText}
                onChange={handleInputChange} 
                onKeyDown={handleKeyDown}
              />
          </div>
          <div
            className='
              shrink-0 ps-[1.5rem] pe-[0.5rem]
              text-light-text-secondary
              dark:text-dark-text-secondary
              cursor-pointer font-semibold
            '
            onClick={handleSearchClick}
          >
            검색
          </div>
        </div>

        {/* 검색 카테고리 탭 */}
        <div className='flex w-full h-[3.5rem] mt-[1.5rem] text-light-text-secondary border-light-gray-1 dark:text-dark-text-secondary dark:border-dark-gray-1 font-medium text sm:text-lg duration-150 border-b'>
          {[
            { path: '/', label: '전체' },
            { path: '/profile', label: '프로필' },
            { path: '/product', label: '장비거래' },
            { path: '/board', label: '커뮤니티' }
          ].map(({ path, label }) => (
            <div
              key={path}
              className={getTabClassName(path)}
              onClick={() => handleTabClick(path)}
            >
              {label}
            </div>
          ))}
        </div>

        {/* 검색화면 */}
        <div className='w-full pt-[1.5rem]'>
          <Routes>
            <Route path='/' element={<SearchAllList key={searchKey} searchText={searchQuery} />} />
            <Route path='/profile' element={<SearchProfileList key={searchKey} searchText={searchQuery} />} />
            <Route path='/board' element={<SearchBoardList key={searchKey} searchText={searchQuery} />} />
            <Route path='/product' element={<SearchProductList key={searchKey} searchText={searchQuery} />} />
            <Route path='*' element={<PageNotFound />} />
          </Routes>
        </div>
      </div>

    </div>
  )
}

export default SearchPage