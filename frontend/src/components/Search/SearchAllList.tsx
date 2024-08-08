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
  const [totalProfileCount, setTotalProfileCount] = useState<number>(0);
  const [totalBoardCount, setTotalBoardCount] = useState<number>(0);
  const [totalProductCount, setTotalProductCount] = useState<number>(0);

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
        setProfileList(filteredProfiles.slice(0, 5));
        setTotalProfileCount(filteredProfiles.length);
      }

      // 2. 상품 검색
      const productResult = await productList({ 
        titleKeyword: props.searchText, 
        productType: '',
        page: 0,
        size: 1000,
      });
      if (productResult && productResult.products) {
        setProductsList(productResult.products.slice(0, 5));
        setTotalProductCount(productResult.products.length);
      }

      // 3. 게시글 검색
      const boardResult = await boardTitleSearch(props.searchText, 0, 1000);
      if (boardResult && Array.isArray(boardResult)) {
        setBoardList(boardResult.slice(0, 3));
        setTotalBoardCount(boardResult.length);
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
      <div className='mb-[3rem]'>
        <div className='flex justify-between mb-1'>
          <p className='font-bold text-lg '>
            프로필
            <span 
              className='
                ms-[0.5rem]
                font-bold
              '
            >
              {totalProfileCount}
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
        <div>
          {profileList.map((profile) => (
              <SearchProfile key={profile.id} profile={profile} />  
            ))
          }
        </div>
      </div>

      {/* 판매/대여 */}
      <div className='mb-[3rem]'>
      <div className='flex justify-between mb-1'>
          <p className='font-bold text-lg '>
            장비거래
            <span 
              className='
                ms-[0.5rem]
                font-bold
              '
            >
              {totalProductCount}
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


      {/* 커뮤니티 */}
      <div className='mb-[3rem]'>
      <div className='flex justify-between mb-1'>
          <p className='font-bold text-lg '>
            커뮤니티
            <span 
              className='
                ms-[0.5rem]
                font-bold
              '
            >
              {totalBoardCount}
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
    </>
  )
}

export default SearchAllList