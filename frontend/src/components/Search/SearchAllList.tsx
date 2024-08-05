import React from 'react'
import { useNavigate } from 'react-router-dom';
import SearchProfile from '@components/Search/SearchProfile'
import SearchBoard from '@components/Search/SerarchBoard'
import SearchProduct from '@components/Search/SearchProduct'
import { ReactComponent as ArrowRightIcon } from '@assets/icons/arrow-right.svg'


type Props = {}

const SearchAllList = (props: Props) => {
  const navigate = useNavigate();

  return (
    <>
    {/* 프로필 */}
      <div className='mb-[3.5rem]'>
        <div className='flex justify-between mb-1'>
          <p className='font-bold text-lg '>
            프로필
            <span 
              className='
                ms-[0.5rem]
                font-bold
              '
            >
              10
            </span>
          </p>
          
          {/* 모두보기 -> 프로필 검색으로 이동 */}
          <div
            className='
            flex items-center
            cursor-pointer
            '
            onClick={() => navigate('/search/profile')}
          >
            <button
              className='
                text-light-text-secondary
                dark:text-dark-text-secondary
                text-[0.9rem]
              '
            >
              모두보기       
            </button>
            <ArrowRightIcon
              className='
                size-[1.1rem]
                fill-light-border-icon
                dark:fill-dark-border-icon
              '
            /> 
          </div>
          
        </div>
        <div className=''>
          <SearchProfile />
          <SearchProfile />
          <SearchProfile />
        </div>
      </div>

      {/* 커뮤니티 */}
      <div className='mb-[3.5rem]'>
      <div className='flex justify-between mb-1'>
          <p className='font-bold text-lg '>
            커뮤니티
            <span 
              className='
                ms-[0.5rem]
                font-bold
              '
            >
              10
            </span>
          </p>
          
          {/* 모두보기 -> 커뮤니티검색으로 이동 */}
          <div
            className='
            flex items-center
            cursor-pointer
            '
            onClick={() => navigate('/search/board')}
          >
            <button
              className='
                text-light-text-secondary
                dark:text-dark-text-secondary
                text-[0.9rem]
              '
            >
              모두보기       
            </button>
            <ArrowRightIcon
              className='
                size-[1.1rem]
                fill-light-border-icon
                dark:fill-dark-border-icon
              '
            /> 
          </div>
          
        </div>
        <div className=''>
          {/* <SearchBoard />
          <SearchBoard />
          <SearchBoard /> */}
        </div>
      </div>

      {/* 판매/대여 */}
      <div className='mb-[2rem]'>
      <div className='flex justify-between mb-1'>
          <p className='font-bold text-lg '>
            장비거래
            <span 
              className='
                ms-[0.5rem]
                font-bold
              '
            >
              10
            </span>
          </p>
          
          {/* 모두보기 -> 장비거래 검색으로 이동 */}
          <div
            className='
            flex items-center
            cursor-pointer
            '
            onClick={() => navigate('/search/product')}
          >
            <button
              className='
                text-light-text-secondary
                dark:text-dark-text-secondary
                text-[0.9rem]
              '
            >
              모두보기       
            </button>
            <ArrowRightIcon
              className='
                size-[1.1rem]
                fill-light-border-icon
                dark:fill-dark-border-icon
              '
            /> 
          </div>
          
        </div>
        <div>
          <SearchProduct />
        </div>
      </div>
    
    
    </>
  )
}

export default SearchAllList