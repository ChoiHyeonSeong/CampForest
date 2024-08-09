import React, { useEffect, useRef, useState } from 'react';

// Component
import ProductCard, { ProductType } from './ProductCard';
import Dropdown from '../Public/Dropdown';
import { productList } from '@services/productService';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setIsLoading } from '@store/modalSlice';
import { useInView } from 'react-intersection-observer';

type Option = {
  id: number;
  name: string;
};

const categories: Option[] = [
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

const prices: Option[] = [
  { id: 1, name: '가격 전체' },
  { id: 2, name: '₩0 - ₩10,000이하' },
  { id: 3, name: '₩10,000 - ₩50,000' },
  { id: 4, name: '₩500,000 - ₩100,000' },
  { id: 5, name: '₩100,000 이상' },
];

const locations: Option[] = [
  { id: 1, name: '지역 전체' },
  { id: 2, name: '수도권' },
  { id: 4, name: '강원' },
  { id: 5, name: '충청' },
  { id: 6, name: '전라' },
  { id: 7, name: '경상' },
  { id: 8, name: '제주' },
];

const ProductList = () => {
  const dispatch = useDispatch();
  const [ref, inView] = useInView();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [nextPageExist, setNextPageExist] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isAccBtnActive, setIsAccBtnActive] = useState(false);
  const [activeTab, setActiveTab] = useState<number>(1);
  const productCursorRef = useRef<number | null>(null);

  // 각 Dropdown에 대한 상태 추가
  const [selectedCategory, setSelectedCategory] = useState<Option>(categories[0]);
  const [selectedPrice, setSelectedPrice] = useState<Option>(prices[0]);
  const [selectedLocation, setSelectedLocation] = useState<Option>(locations[0]);

  const handleToggle = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleAccBtnClick = () => {
    setIsAccBtnActive(!isAccBtnActive);
  };

  const handleTabClick = (tabIndex: number) => {
    if (tabIndex !== activeTab) {
      setProducts([]);
      setNextPageExist(true);
      productCursorRef.current = null;
    }
    setActiveTab(tabIndex);
  };

  // 각 Dropdown의 선택을 처리하는 함수들
  const handleCategorySelect = (option: Option) => {
    setSelectedCategory(option);
  };

  const handlePriceSelect = (option: Option) => {
    setSelectedPrice(option);
  };

  const handleLocationSelect = (option: Option) => {
    setSelectedLocation(option);
  };

  const fetchProducts = async () => {
    try {
      dispatch(setIsLoading(true));
      let result: {
        hasNext: boolean, 
        nextCursorId: number | null, 
        products: ProductType[],
        totalCount: number,
      }

      if (productCursorRef.current !== null) {
        result = await productList({
          productType: activeTab === 1 ? 'SALE' : 'RENT',
          cursorId: productCursorRef.current,
          size: 20,
        });
      } else {
        result = await productList({
          productType: activeTab === 1 ? 'SALE' : 'RENT',
          size: 20,
        });
      }
      
      dispatch(setIsLoading(false));
      productCursorRef.current = result.nextCursorId;
      if (!result.hasNext) {
        setNextPageExist(false);
      }
      setProducts((prevProducts) => [...prevProducts, ...result.products]);
    } catch (error) {
      dispatch(setIsLoading(false));
      console.error('판매/대여 게시글 불러오기 실패: ', error);
    }
  };

  useEffect(() => {
    // inView가 true일 때만 실행한다.
    if (inView && nextPageExist) {
      console.log(inView, '무한 스크롤 요청');
      fetchProducts();
    }
  }, [inView, activeTab]);

  return (
    <div className={`flex justify-center items-center`}>
      <div className={`w-full lg:w-[60rem] xl:w-[66rem] max-lg:p-[1.5rem]`}>
        <div className={`hidden md:flex items-center justify-between mt-[1.5rem] mb-[2.5rem]`}>
          <div className={`font-medium md:text-2xl lg:text-3xl`}>
            상품 판매/대여
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
        <div className={`flex w-full h-[3rem] mb-[2.5rem]`}>
          <div
            onClick={() => handleTabClick(1)}
            className={`
              ${activeTab === 1 ? 'border-light-signature dark:border-dark-signature' : 'border-light-border dark:border-dark-border'}
              flex items-center w-1/2 
              border-light-border
              dark:border-dark-border
              md:text-lg font-medium text-center cursor-pointer border-b-2 transition-all duration-200 
            `}
          >
            <div 
              className={`
                w-full 
                text-center
              `}
            >
              판매
            </div>
          </div>
          <div
            onClick={() => handleTabClick(2)}
            className={`
              ${activeTab === 2 ? 'border-light-signature dark:border-dark-signature' : 'border-light-border dark:border-dark-border'}
              flex items-center w-1/2 
              md:text-lg font-medium text-center cursor-pointer border-b-2 transition-all duration-200 
            `}
          >
            <div 
              className={`
                w-full 
                text-center
              `}
            >
              대여
            </div>
          </div>
        </div>


        <div className={`flex flex-wrap gap-[0.5rem] items-center relative z-[15] mb-[0.75rem]`}>
          <Dropdown
            label="카테고리"
            options={categories}
            isOpen={openDropdown === 'categories'}
            onToggle={() => handleToggle('categories')}
            onSelect={handleCategorySelect}
            selectedOption={selectedCategory}
          />
          <Dropdown
            label="가격"
            options={prices}
            isOpen={openDropdown === 'prices'}
            onToggle={() => handleToggle('prices')}
            onSelect={handlePriceSelect}
            selectedOption={selectedPrice}
          />
          <Dropdown
            label="지역"
            options={locations}
            isOpen={openDropdown === 'locations'}
            onToggle={() => handleToggle('locations')}
            onSelect={handleLocationSelect}
            selectedOption={selectedLocation}
          />
          <div
            className={`
              px-[1rem] py-[0.5rem]
              border-light-border
              dark:border-dark-border
              text-sm font-medium duration-200 cursor-pointer rounded-md border shadow-sm focus:outline-none ${
              isAccBtnActive
                ? 'bg-light-signature dark:bg-dark-signature text-light-white border-light-signature dark:border-dark-signature'
                : 'bg-light-gray dark:bg-dark-gray border-light-border-1 dark:border-dark-border-1'
              }
            `}
            onClick={handleAccBtnClick}
          >
            <p>
              거래 가능
            </p>
          </div>
        </div>
        <div className={`grid lg:grid-cols-5 md:grid-cols-4 grid-cols-3 w-full`}>
          {products?.map(
            (product) =>
              (!product.sold || !isAccBtnActive) && (
                <ProductCard 
                  key={product.productId} 
                  product={product} 
                />
              ),
          )}
        </div>
      </div>
      {/* intersection observer */}
      <div ref={ref} className="h-[0.25rem]"></div>
    </div>
  );
};

export default ProductList;
