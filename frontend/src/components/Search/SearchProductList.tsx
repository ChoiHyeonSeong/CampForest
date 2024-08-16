import React, { useEffect, useState, useCallback, useRef } from 'react';
import { productList } from '@services/productService';
import SearchProduct from '@components/Search/SearchProduct';
import { ProductType } from '@components/Product/ProductCard';
import NoResultSearch from '@components/Search/NoResultSearch'

import { useInView } from 'react-intersection-observer';

type Props = {
  searchText: string;
}

const SearchProductList = (props : Props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('전체');
  const [products, setProducts] = useState<ProductType[]>([]);
  const [searchCount, setSearchCount] = useState(0);

  const [ref, inView] = useInView();
  const [nextPageExist, setNextPageExist] = useState(true);

  const nextCursorRef = useRef<number | null>(null)
  
  const fetchProductList = async () => {
    if (props.searchText.length < 2) {
      setProducts([]);
      setSearchCount(0);
      return;
    }

    try {
      const result = await productList({ 
        titleKeyword: props.searchText, 
        productType: selectedFilter === '전체' ? '' : selectedFilter === '판매' ? 'SALE' : 'RENT',
        cursorId: nextCursorRef.current,
        size: 20,
      });
      console.log(result)
      setProducts((prevProducts) => [...prevProducts, ...result.products]);
      setSearchCount(result.totalCount);

      if (!result.hasNext) {
        setNextPageExist(false)
      } 
      nextCursorRef.current = result.nextCursorId
    } catch (error) {
      console.error("Error fetching product list:", error);
      setProducts([]);
      setSearchCount(0);
    }
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleFilterChange = (filter: string) => {
    nextCursorRef.current = null
    setProducts([]);
    setSearchCount(0);
    setNextPageExist(true);
    setSelectedFilter(filter);
    setIsDropdownOpen(false);
  };
 
  useEffect(() => {
    fetchProductList();
  }, [selectedFilter])

  useEffect(() => {
    if (inView && nextPageExist) {
      console.log(inView, '무한 스크롤 요청');
      fetchProductList();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [inView]);

  return (
    <div>
      <div className='flex justify-between items-center'>
        <div className='flex items-center'>
          <p className='font-medium text-lg md:text-xl'>
            장비거래<span className='ms-[0.5rem] font-bold'>{searchCount}</span>
          </p>
          <p className='
            ms-[1rem]
            text-light-text-secondary
            dark:text-dark-text-secondary
            '
          >
            <span
              className='
                me-[0.25rem]
                text-light-signature
                dark:text-dark-signature
                font-semibold 
              '
            >
              {selectedFilter}
            </span>
            검색결과
          </p>
        </div>
       
        {/* 드롭다운 필터 */}
        <div className='relative'>
          {/* 드롭다운 버튼 */}
          <button 
            onClick={toggleDropdown}
            className='
              relative px-[0.8rem] py-[0.2rem] 
              bg-light-signature text-light-white 
              dark:bg-dark-signature
              rounded-sm cursor-pointer
            '
          >
            필터
          </button>

          {/* 드롭다운 메뉴 */}
          {isDropdownOpen && (
            <div className='absolute z-[15] right-0 w-[5rem] mt-[0.5rem] bg-light-white dark:bg-dark-white shadow-lg rounded-md font-medium overflow-hidden'>
              <div className='py-[0.5rem]'>
                {['전체', '판매', '대여'].map((filter) => (
                  <button
                    key={filter}
                    className='block w-full ps-[1rem] py-[0.5rem] text-light-text-secondary hover:text-light-signature text-left cursor-pointer'
                    onClick={() => handleFilterChange(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {products.length !== 0 
        ? <SearchProduct product={products}/>
        : <NoResultSearch searchText={props.searchText} />
      }
      
      <div ref={ref} className={`${products.length >= 1 ? 'block' : 'hidden'} h-[0.25rem]`}></div>
    </div>
  )
}

export default SearchProductList