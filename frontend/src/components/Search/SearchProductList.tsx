import React, { useEffect, useState, useCallback } from 'react';
import { productSearch } from '@services/productService';
import SearchProduct from '@components/Search/SearchProduct';
import { ProductType } from '@components/Product/ProductCard';
import NoResultSearch from '@components/Search/NoResultSearch'

type Props = {
  searchText: string;
}

const SearchProductList = (props: Props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('전체');
  const [productList, setProductList] = useState<ProductType[]>([]);
  const [searchCount, setSearchCount] = useState(0);

  // API 연동
  const fetchProductList = useCallback(async () => {
    const result = await productSearch({ productType: '', titleKeyword: props.searchText });
    if (result && result.content) {
      setSearchCount(result.totalElements);
      setProductList(result.content);
    } else {
      setSearchCount(0);
      setProductList([]);
    }
  }, [props.searchText]);

  
  useEffect(() => {
    fetchProductList();
  }, [fetchProductList]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    setIsDropdownOpen(false);
  };

  // 드롭다운 메뉴 필터링하기 (판매인지 대여인지)
  const filteredProducts = productList.filter(product => {
    if (selectedFilter === '전체') return true;
    if (selectedFilter === '판매') return product.productType === 'SALE';
    if (selectedFilter === '대여') return product.productType === 'RENT';
    return true;
  });

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
            <div
              className='
                absolute z-[15] right-0 w-[5rem] mt-[0.5rem]
                bg-light-white
                dark:bg-dark-white
                shadow-lg rounded-md font-medium overflow-hidden'
            >
              <div className='py-[0.5rem]'>
                <button
                  className='
                    block w-full ps-[1rem] py-[0.5rem]
                    text-light-text-secondary hover:text-light-signature
                    text-left cursor-pointer
                  '
                  onClick={() => handleFilterChange('전체')}
                >
                  전체
                </button>
                <button
                  className='
                    block w-full ps-[1rem] py-[0.5rem]
                    text-light-text-secondary hover:text-light-signature
                    text-left cursor-pointer
                  '
                  onClick={() => handleFilterChange('판매')}
                >
                  판매
                </button>
                <button
                  className='
                    block w-full ps-[1rem] py-[0.5rem]
                    text-light-text-secondary hover:text-light-signature
                    text-left cursor-pointer
                  '
                  onClick={() => handleFilterChange('대여')}
                >
                  대여
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {filteredProducts.length !== 0 
        ?
        <SearchProduct product={filteredProducts}/>
        :
        <NoResultSearch />
      }
    </div>
  )
}

export default SearchProductList