import React, { useState, useEffect } from 'react';
import { ReactComponent as SearchIcon } from '@assets/icons/nav-search.svg'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import SearchProfileList from '@components/Search/SearchProfileList'
import SearchBoardList from '@components/Search/SearchBoardList'
import SearchProductList from '@components/Search/SearchProductList'
import SearchAllList from '@components/Search/SearchAllList';

const SearchPage = () => {
  const [inputText, setInputText] = useState(''); // 입력 중인 검색값임
  const [searchQuery, setSearchQuery] = useState(''); // 실제 검색에 사용될 쿼리임
  const [activeTab, setActiveTab] = useState(''); // 현재 활성화된 탭
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('query') || '';
    setInputText(query);
    setSearchQuery(query);
    const path = location.pathname.replace('/search', '') || '/';
    setActiveTab(path);
  }, [location.search, location.pathname]);

  // 검색어 길이가 2개 이상인지 확인
  const handleSearch = (path: string = '') => {
    if (inputText.length < 2) {
      alert('검색어는 두 글자 이상 입력해야 합니다.');
      return;
    }
    setSearchQuery(inputText);
    navigate(`/search${path}?query=${encodeURIComponent(inputText)}`);
  };

  // 엔터키로 검색 가능하게 하기
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // 현재 경로를 확인하여 적절한 path를 결정
      const currentPath = location.pathname;
      let searchPath = '';
      if (currentPath.includes('/search/profile')) {
        searchPath = '/profile';
      } else if (currentPath.includes('/search/board')) {
        searchPath = '/board';
      } else if (currentPath.includes('/search/product')) {
        searchPath = '/product';
      }
      // 결정된 path로 검색 실행
      handleSearch(searchPath);
    }
  };

  // 검색카테고리 탭 클릭 시 해당경로로 이동하기
  const handleTabClick = (path: string) => {
    setActiveTab(path);
    navigate(`/search${path}?query=${encodeURIComponent(searchQuery)}`);
  };

  // input 값 변경 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };


  // 현재 경로와 비교하여 탭 클래스 이름 설정
  const getTabClassName = (path: string) => {
    return location.pathname.startsWith(`/search${path}`) || activeTab === path ?
      `
        flex flex-all-center px-[0.5rem] md:px-[1.5rem] h-full
        border-light-signature text-light-text
        dark:text-dark-text
        font-semibold border-b-2 cursor-pointer
      ` :
      `
        flex flex-all-center px-[0.5rem] md:px-[1.5rem] h-full
        hover:border-light-signature hover:text-light-text
        dark:hover:text-dark-text
        hover:font-semibold hover:border-b-2 cursor-pointer
      `
  };


  return (
    <div className='flex justify-center min-h-screen'>
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
                cursor-pointer
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
            onClick={() => handleSearch(location.pathname.replace('/search', ''))}
          >
            검색
          </div>
        </div>

        {/* 검색 카테고리 탭 */}
        <div
          className='
            flex w-full h-[3.5rem] mt-[1.5rem]
            text-light-text-secondary border-light-gray-1
            dark:text-dark-text-secondary dark:border-dark-gray-1
            font-medium text sm:text-lg duration-150 border-b
            '
          >
          <div
            className={getTabClassName('')}
            onClick={() => handleTabClick('')}
            >
              전체
          </div>
          <div
            className={getTabClassName('/profile')}
            onClick={() => handleTabClick('/profile')}
            >
              프로필
          </div>
          <div
            className={getTabClassName('/board')}
            onClick={() => handleTabClick('/board')}
            >
              커뮤니티
          </div>
          <div
            className={getTabClassName('/product')}
            onClick={() => handleTabClick('/product')}
            >
              장비거래
          </div>

        </div>

        {/* 검색화면 */}
        <div className='w-full pt-[1.5rem]'>
          <Routes>
            <Route path='/' element={<SearchAllList searchText={searchQuery} />} />
            <Route path='/profile' element={<SearchProfileList searchText={searchQuery} />} />
            <Route path='/board' element={<SearchBoardList searchText={searchQuery} />} />
            <Route path='/product' element={<SearchProductList searchText={searchQuery} />} />
          </Routes>
        </div>
      </div>

    </div>
  )
}

export default SearchPage