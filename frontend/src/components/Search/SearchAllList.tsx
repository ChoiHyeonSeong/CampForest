import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchProfile, { profileType } from '@components/Search/SearchProfile'
import SearchBoard from '@components/Search/SerarchBoard'
import SearchProduct from '@components/Search/SearchProduct'
import { ReactComponent as ArrowRightIcon } from '@assets/icons/arrow-right.svg'
import { nicknameSearch } from '@services/userService'
import { boardTitleSearch } from '@services/boardService'
import { productList } from '@services/productService'
import { BoardType } from '@components/Board/Board';
import { ProductType } from '@components/Product/ProductCard';


type Props = {
  searchText: string;
}

const SearchAllList = (props: Props) => {
  const navigate = useNavigate();
  const [profileList, setProfileList] = useState<profileType[]>([]);
  const [productsList, setProductsList] = useState<ProductType[]>([]);
  const [boardList, setBoardList] = useState<BoardType[]>([]);

  const fetchAllSearchResults = useCallback(async () => {
    if (props.searchText.length < 2) {
      setProfileList([]);
      setProductsList([]);
      setBoardList([]);
      return;
    }

    try {
      // 1. 프로필 검색
      const profileResult = await nicknameSearch(props.searchText);
      if (profileResult.users && Array.isArray(profileResult.users)) {
        const filteredProfiles = profileResult.users.filter((profile: profileType) => 
          profile.nickname.includes(props.searchText)
        );
        setProfileList(filteredProfiles);
      }

      // 상품 검색
      const productResult = await productList({ 
        titleKeyword: props.searchText, 
        productType: '', // 전체 검색이므로 빈 문자열
        page: 0,
        size: 5, // 전체 검색에서는 각 카테고리별로 일부만 보여줄 것이므로 5개로 제한
      });
      if (productResult && productResult.products) {
        setProductsList(productResult.products);
      }

      // 게시글 검색
      const boardResult = await boardTitleSearch(props.searchText, 0, 3);
      if (boardResult && Array.isArray(boardResult)) {
        setBoardList(boardResult);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }, [props.searchText]);

  useEffect(() => {
    fetchAllSearchResults();
  }, [fetchAllSearchResults]);
  

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
              {profileList.length}
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
          {profileList.map((profile) => (
              <SearchProfile profile={profile} />  
            ))
          }
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
              {boardList.length}
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
          {boardList.map((board) =>
              <SearchBoard board={board}/>  
            )
          }
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
              {productsList.length}
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
          <SearchProduct product={productsList} />
        </div>
      </div>
    
    
    </>
  )
}

export default SearchAllList