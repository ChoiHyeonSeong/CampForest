import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import { setIsLoading } from '@store/modalSlice';
import { productList } from '@services/productService';
import ProductCard, { ProductType } from '@components/Product/ProductCard';
import Dropdown from '@components/Public/Dropdown';
import PriceRangeModal from '@components/Product/PriceRangeModal';
import { ReactComponent as RightArrowIcon } from '@assets/icons/arrow-right.svg';

import LocationFilter from '@components/Public/LocationFilter';

import { koreaAdministrativeDivisions } from '@utils/koreaAdministrativeDivisions';

import Pagination from '@components/Public/Pagination';

type Option = {
  id: number;
  name: string;
};

const CATEGORIES: Option[] = [
  { id: 1, name: '분류 전체' },
  { id: 2, name: '텐트' },
  { id: 3, name: '의자' },
  { id: 4, name: '침낭/매트' },
  { id: 5, name: '테이블' },
  { id: 6, name: '랜턴' },
  { id: 7, name: '코펠/식기' },
  { id: 8, name: '안전용품' },
  { id: 9, name: '버너/화로' },
  { id: 10, name: '기타' },
];

const LOCATIONS: Option[] = [
  { id: 1, name: '지역 전체' },
  { id: 2, name: '수도권' },
  { id: 4, name: '강원' },
  { id: 5, name: '충청' },
  { id: 6, name: '전라' },
  { id: 7, name: '경상' },
  { id: 8, name: '제주' },
];

type SelecetedLocType = {
  city: string; 
  districts: string[];
}

const ProductList = () => {
  // Redux
  const dispatch = useDispatch();

  // 상태 관리
  const [products, setProducts] = useState<ProductType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Option>(CATEGORIES[0]);
  // const [selectedLocation, setSelectedLocation] = useState<Option>(LOCATIONS[0]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [nextPageExist, setNextPageExist] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<SelecetedLocType | null>(null);

  // 상태 추가
const [totalPages, setTotalPages] = useState<number>(0);
const [currentPage, setCurrentPage] = useState<number>(1);

  // Refs
  const productCursorRef = useRef<number | null>(null);

  // 무한 스크롤
  const [ref, inView] = useInView();

  // 상품 필터링 로직
  const filterProducts = useCallback(() => {
    let filtered = products.filter(product => 
      product.productPrice >= priceRange[0] && 
      product.productPrice <= priceRange[1]
    );

    if (selectedCategory.name !== '분류 전체') {
      filtered = filtered.filter(product => product.category === selectedCategory.name);
    }

    // if (selectedLocation.name !== '지역 전체') {
    //   filtered = filtered.filter(product => product.location.includes(selectedLocation.name));
    // }

    if (showAvailableOnly) {
      filtered = filtered.filter(product => !product.sold);
    }

    setFilteredProducts(filtered);
  }, [products, priceRange, selectedCategory, selectedLocation, showAvailableOnly]);

  // 페이지 가져오기


  // 상품 데이터 fetch
  const fetchProducts = useCallback(async () => {
    try {
      dispatch(setIsLoading(true));
      const result = await productList({
        productType: activeTab === 1 ? 'SALE' : 'RENT',
        cursorId: productCursorRef.current,
        size: 20,
      });
      
      console.log(result)
      dispatch(setIsLoading(false));
      productCursorRef.current = result.nextCursorId;
      setNextPageExist(result.hasNext);
      setProducts(prevProducts => [...prevProducts, ...result.products]);

      // 전체 페이지 수 계산 (한 페이지당 10개 항목 기준)
      const calculatedTotalPages = Math.ceil(result.totalCount / 10);
      setTotalPages(calculatedTotalPages);
    
    } catch (error) {
      dispatch(setIsLoading(false));
      console.error('판매/대여 게시글 불러오기 실패: ', error);
    }
  }, [dispatch, activeTab]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // 여기에 새 페이지의 데이터를 가져오는 로직 추가
    // 예: fetchProductsForPage(newPage);
  };  

  // 이벤트 핸들러
  const handleTabClick = useCallback((tabIndex: number) => {
    if (tabIndex !== activeTab) {
      setProducts([]);
      setNextPageExist(true);
      productCursorRef.current = null;
      setActiveTab(tabIndex);
    }
  }, [activeTab]);

  const handleApplyPriceRange = useCallback((min: number, max: number) => {
    setPriceRange([min, max]);
    setIsModalOpen(false);
  }, []);

  const handleToggle = useCallback((dropdown: string) => {
    setOpenDropdown(prev => prev === dropdown ? null : dropdown);
  }, []);

  // useEffect 훅
  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  useEffect(() => {
    if (inView && nextPageExist) {
      fetchProducts();
    }
  }, [inView, nextPageExist, fetchProducts]);

  const handleSelect = (city: string, districts: string[]) => {
    setSelectedLocation({ city, districts });
    console.log(city, districts)
  };

  return (
    <div className={`flex justify-center items-center`}>
      <div className={`w-full lg:w-[60rem] xl:w-[66rem] max-lg:p-[1.5rem]`}>
        <div className={`hidden md:flex items-center justify-between lg:mt-[3rem] mb-[2.5rem]`}>
          <div className={`flex font-medium md:text-[1.6rem]`}>
            <p>상품 판매/대여</p>
            <div className='flex items-center ms-[0.75rem]'>
              <RightArrowIcon className='fill-light-black dark:fill-dark-black' />
              <span className='ms-[0.75rem] text-base text-light-signature dark:text-dark-signature'>
                title
              </span>
            </div>
            
          </div>
          <Link
            to="/product/write"
            className={`
              px-[0.5rem] py-[0.25rem]
              bg-light-signature text-light-white
              dark:bg-dark-signature dark:text-dark-white
              text-sm cursor-pointer rounded-sm
            `}
          >
            작성하기
          </Link>
        </div>

        {/* 탭 */}
        <div className="flex w-full h-[3rem] mb-[2.5rem]">
          {['판매', '대여'].map((tab, index) => (
            <div
              key={tab}
              onClick={() => handleTabClick(index + 1)}
              className={`flex items-center justify-center w-1/2 md:text-lg font-medium cursor-pointer border-b-2 transition-all duration-200 ${
                activeTab === index + 1 ? 'border-light-signature dark:border-dark-signature' : 'border-light-border dark:border-dark-border'
              }`}
            >
              {tab}
            </div>
          ))}
        </div>


        {/* 필터 */}
        <div className="flex flex-wrap gap-[0.5rem] items-center relative z-[30] mb-[0.75rem]">
          <Dropdown
            label="카테고리"
            options={CATEGORIES}
            isOpen={openDropdown === 'categories'}
            onToggle={() => handleToggle('categories')}
            onSelect={setSelectedCategory}
            selectedOption={selectedCategory}
          />
          <div>
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="px-[1rem] py-[0.5rem] border-light-border bg-light-gray dark:border-dark-border dark:bg-dark-gray text-sm font-medium rounded-md border shadow-sm"
            >
              {priceRange[0] === 0 && priceRange[1] === 500000
                ? "가격 필터"
                : `${priceRange[0].toLocaleString()}원 ~ ${priceRange[1].toLocaleString()}원`}
            </button>
            <PriceRangeModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onApply={handleApplyPriceRange}
            />
          </div>
          
          <div 
            className={`
              inline-block relative
              text-center
            `}
          >
            <button
              type="button"
              className={`  
                inline-flex justify-between items-center w-full min-w-[4rem] px-[1rem] py-[0.5rem]
                bg-light-gray
                dark:bg-dark-gray
                text-sm font-medium rounded-md shadow-sm`}
              onClick={() => setIsFilterOpen(true)}
            >
              지역 필터
            </button>
          </div>

          {/* <Dropdown
            label="지역"
            options={LOCATIONS}
            isOpen={openDropdown === 'locations'}
            onToggle={() => handleToggle('locations')}
            onSelect={setSelectedLocation}
            selectedOption={selectedLocation}
          /> */}

          <LocationFilter 
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            divisions={koreaAdministrativeDivisions}
            onSelect={handleSelect}
            selectedLocation={selectedLocation}
          />
              

          <button
            className={`px-[1rem] py-[0.5rem] text-sm font-medium duration-200 cursor-pointer rounded-md shadow-sm ${
              showAvailableOnly
                ? 'bg-light-signature dark:bg-dark-signature text-light-white'
                : 'bg-light-gray dark:bg-dark-gray text-light-black dark:text-dark-black'
            }`}
            onClick={() => setShowAvailableOnly(!showAvailableOnly)}
          >
            거래 가능
          </button>
        </div>


        {/* 상품 목록 */}
        <div className="grid lg:grid-cols-5 md:grid-cols-4 grid-cols-3 w-full">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.productId} 
              product={product} 
            />
          ))}
        </div>

        <Pagination
          totalItems={products.length}
          itemsPerPage={10}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>

      {/* intersection observer */}
      {/* <div ref={ref} className="h-[0.25rem]"></div> */}
    </div>
  );
};

export default ProductList;
