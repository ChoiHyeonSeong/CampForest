import React, { useState, useEffect } from 'react';
import { ReactComponent as SearchIcon } from '@assets/icons/nav-search.svg'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import SearchProfileList from '@components/Search/SearchProfileList'
import SerarchBoardList from '@components/Search/SearchBoardList'
import SearchProductList from '@components/Search/SearchProductList'
import SearchAllList from '@components/Search/SearchAllList';

const SearchPage = () => {
  const [searchText, setSearchText] = useState('');
  const [searchExecuted, setSearchExecuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('query') || '';
    setSearchText(query);
    setSearchExecuted(!!query);
  }, [location.search]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSearch = () => {
    if (searchText.length < 2) {
      alert('검색어는 두 글자 이상 입력해야 합니다.');
      return;
    }
    navigate(`/search?query=${searchText}`);
    setSearchExecuted(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleTabClick = (path: string) => {
    navigate(`/search${path}?query=${encodeURIComponent(searchText)}`);
  };

  const getTabClassName = (path: string) => {
    return location.pathname === path ?
      `
        flex flex-all-center px-[0.5rem] md:px-[1.5rem] h-full
        border-light-signature text-light-text dark:text-dark-text
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
              cursor-pointer font-semibold
            '
            onClick={handleSearch}
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
            className={getTabClassName('/search')}
            onClick={() => handleTabClick('')}
            >
              전체
          </div>
          <div
            className={getTabClassName('/search/profile')}
            onClick={() => handleTabClick('/profile')}
            >
              프로필
          </div>
          <div
            className={getTabClassName('/search/board')}
            onClick={() => handleTabClick('/board')}
            >
              커뮤니티
          </div>
          <div
            className={getTabClassName('/search/product')}
            onClick={() => handleTabClick('/product')}
            >
              장비거래
          </div>

        </div>

        {/* 검색화면 */}
        <div className='w-full pt-[1.5rem]'>
          <Routes>
            <Route path='/' element={<SearchAllList />} />
            <Route path='profile' element={<SearchProfileList nickname={searchText} />} />
            <Route path='board' element={<SerarchBoardList searchText={searchText} />} />
            <Route path='product' element={<SearchProductList searchText={searchText} />} />
          </Routes>
        </div>
      </div>

    </div>
  )
}

export default SearchPage