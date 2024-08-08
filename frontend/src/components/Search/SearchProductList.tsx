import React, { useEffect, useState, useCallback } from 'react';
import { productList } from '@services/productService';
import SearchProduct from '@components/Search/SearchProduct';
import { ProductType } from '@components/Product/ProductCard';
import NoResultSearch from '@components/Search/NoResultSearch'

type Props = {
  searchText: string;
}

const SearchProductList = (props : Props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('전체');
  const [products, setProducts] = useState<ProductType[]>([]);
  const [searchCount, setSearchCount] = useState(0);

  const fetchProductList = useCallback(async () => {
    if (props.searchText.length < 2) {
      setProducts([]);
      setSearchCount(0);
      return;
    }

    try {
      const result = await productList({ 
        titleKeyword: props.searchText, 
        productType: selectedFilter === '전체' ? '' : selectedFilter === '판매' ? 'SALE' : 'RENT',
        page: 0,
        size: 10,
      });
      
      if (result && result.products) {
        setProducts(result.products);
        setSearchCount(result.totalElements || 0);
      } else {
        setProducts([]);
        setSearchCount(0);
      }
    } catch (error) {
      console.error("Error fetching product list:", error);
      setProducts([]);
      setSearchCount(0);
    }
  }, [props.searchText, selectedFilter]);


  useEffect(() => {
    fetchProductList();
  }, [fetchProductList]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    setIsDropdownOpen(false);
    fetchProductList();
  };
 
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
    </div>
  )
}

export default SearchProductList