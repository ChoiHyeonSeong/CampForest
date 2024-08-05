import React, { useState } from 'react';
import { ReactComponent as SearchIcon } from '@assets/icons/nav-search.svg'
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import SearchProfileList from '@components/Search/SearchProfileList'
import SerarchBoardList from '@components/Search/SearchBoardList'
import SearchProductList from '@components/Search/SearchProductList'
import SearchAllList from '@components/Search/SearchAllList';



type Props = {}

const SearchPage = (props: Props) => {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabClick = (path: string) => {
    navigate(path);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleClearInput = () => {
    setSearchText('');
  };

  return (
    <div className='flex justify-center min-h-screen'>
      <div className='w-full lg:w-[65%] lg:min-w-[56rem] max-lg:p-[1.5rem] lg:py-[2.5rem]'>
        <h4 className='mb-[1.5rem] text-xl'><span className='font-medium me-[0.25rem]'>개발</span>에 대한 126개 검색결과</h4>
        
        {/* 검색창  */}
        <div
          className='
            flex justify-between items-center w-full h-[2.8rem] md:h-[3.1rem] mb-[0.5rem] px-[0.5rem]
            text-light-text bg-light-gray
            dark:text-dark-text dark:bg-light-gray
            font-medium text-lg rounded
            '
          >
          <div className='flex items-center'>
          <SearchIcon className='size-[1.4rem] md:size-[1.6rem] me-[1rem] stroke-light-border-icon dark:stroke-light-dark-icon' />
          <input
              placeholder='키워드로 검색해보세요.'
              className='outline-none bg-transparent'
              value={searchText}
              onChange={handleInputChange}
            />
          </div>
          <CloseIcon
            className='size-[1.4rem] md:size-[1.6rem] fill-light-border-icon dark:fill-dark-border-icon cursor-pointer'
            onClick={handleClearInput}
          />
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
            onClick={() => handleTabClick('/search')}
            >
              전체
          </div>
          <div
            className={getTabClassName('/search/profile')}
            onClick={() => handleTabClick('/search/profile')}
            >
              프로필
          </div>
          <div
            className={getTabClassName('/search/board')}
            onClick={() => handleTabClick('/search/board')}
            >
              커뮤니티
          </div>
          <div
            className={getTabClassName('/search/product')}
            onClick={() => handleTabClick('/search/product')}
            >
              장비거래
          </div>

        </div>

        {/* 검색화면 */}
        <div className='w-full pt-[1.5rem]'>
          <Routes>
            <Route path='/' element={<SearchAllList />} />
            <Route path='profile' element={<SearchProfileList />} />
            <Route path='board' element={<SerarchBoardList />} />
            <Route path='product' element={<SearchProductList />} />
          </Routes>
        </div>
      </div>

    </div>
  )
}

export default SearchPage