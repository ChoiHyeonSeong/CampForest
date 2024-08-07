import React, { useState, useEffect, useRef } from 'react'

import { ReactComponent as ArticleIcon } from '@assets/icons/article-outline.svg';
import { ReactComponent as Heart } from '@assets/icons/heart.svg';
import { ReactComponent as FilterIcon } from '@assets/icons/filter2.svg';

import ProductCard, { ProductType } from '@components/Product/ProductCard';

import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useInView } from 'react-intersection-observer';

import { likedList, productList } from '@services/productService';
import { setIsLoading } from '@store/modalSlice';
import { RootState } from '@store/store';
import { setProductCount } from '@store/profileSlice';
import { savedList } from '@services/boardService';


type Props = {}

const UProduct = (props: Props) => {
  const [myBoard, setMyBoard] = useState(true);
  const userId = Number(useParams().userId);
  const userState = useSelector((state: RootState) => state.userStore);
  const dispatch = useDispatch();
  const [ref, inView] = useInView();
  const [likedRef, likedInView] = useInView();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [likedProducts, setLikedProducts] = useState<ProductType[]>([]);
  const [nextPageExist, setNextPageExist] = useState(true);
  const [nextLikedPageExist, setNextLikedPageExist] = useState(true);
  const isFirstLoadRef = useRef(true);
  const isFirstLikedLoadRef = useRef(true);
  const productPageRef = useRef(0);
  const likedProductPageRef = useRef(0);

  const fetchProducts = async () => {
    try {
      dispatch(setIsLoading(true));
      const response = await productList({findUserId: userId, productType: ''});
      dispatch(setProductCount(response.products.length));
      dispatch(setIsLoading(false));

      productPageRef.current += 1;
      if (response.products.last) {
        setNextPageExist(false);
      }
      setProducts((prevProducts) => [...prevProducts, ...response.products]);
    } catch (error) {
      dispatch(setIsLoading(false));
      console.error("Failed to fetch products: ", error);
    }
  }

  const fetchLikedProducts = async () => {
    try {
      dispatch(setIsLoading(true));
      const response = await likedList();
      // console.log(response);
      dispatch(setIsLoading(false));

      // likedProductPageRef.current += 1;
      // if (response.products.last) {
      //   setNextLikedPageExist(false);
      // }
      // setLikedProducts((prevProducts) => [...prevProducts, ...response.products]);
    } catch (error) {
      console.error("Failed to fetch likedProducts: ", error);
    }
  }

  useEffect(() => {
    // inView가 true일 때만 실행한다.
    if (inView && nextPageExist) {
      console.log(inView, '작성글 무한 스크롤 요청');
      fetchProducts();
    }
  }, [inView]);

  useEffect(() => {
    // inView가 true일 때만 실행한다.
    if (likedInView && nextLikedPageExist) {
      console.log(inView, '관심 무한 스크롤 요청');
      fetchLikedProducts();
    }
  }, [likedInView]);

  const pageReload = () => {
    isFirstLoadRef.current = true;
    isFirstLikedLoadRef.current = true;
    fetchProducts();
    fetchLikedProducts();
  };

  useEffect(() => {
    pageReload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  function handleType (myBoard: boolean) {
    if (myBoard) {
      setMyBoard(true);
    } else {
      setMyBoard(false);
    }
  }

  return (
    <div>
      <div>
        {/* 작성글, 저장됨, 필터 */}
        <div
          className={`
            ${userId !== userState.userId ? 'hidden' : ''}
            flex justify-center relative mt-[1.5rem] mb-[1.5rem]
          `}
        >
          {/* 작성글 */}
          <div
            onClick={() => handleType(true)}
            className={`
              ${myBoard ? 'font-bold' : 'text-light-text-secondary'}
              flex items-center
            `}
          >
            <ArticleIcon 
              className={`
                ${myBoard ? 'fill-light-black' : 'fill-light-gray-1'}
                size-[1rem]
              `}
            />
            <span
              className={`
                ms-[0.5rem]
                text-[0.875rem]
              `}
            >
              작성글
            </span>
          </div>
          {/* 북마크 */}
          <div 
            onClick={() => handleType(false)}
            className={`
              flex items-center ms-[2.5rem]
            `}
          >
            <Heart 
              className={`
                ${myBoard ? 'fill-light-gray-1' : ''}
                size-[1.25rem]
              `}
            />
            <span
              className={`
                ${!myBoard ? 'font-bold' : 'text-light-text-secondary'}
                ms-[0.5rem]
                text-[0.875rem]
              `}
            >
              관심
            </span>
          </div>
          {/* 필터 */}
          <div className="flex justify-end absolute right-0">
            <div className="flex items-center ms-auto px-[0.5rem] text-sm">
              <div
                className={`
                ms-[0.5rem]
                text-[0.875rem]
              `}
              >
                필터
              </div>
              <FilterIcon
                className={`
                size-[1.25rem] ms-[0.5rem] 
                fill-light-border-icon 
                dark:fill-dark-border-icon
              `}
              />
            </div>
          </div>
        </div>
      </div>
      <div 
        className={`
          ${myBoard ? '' : 'hidden'}
          grid grid-cols-2 md:grid-cols-3
        `}
      >
        {products?.map((product: any, key) => (
          <ProductCard key={key} product={product}/>
        ))}
        <div ref={ref} className={`${isFirstLoadRef.current ? 'hidden' : 'block'} h-[0.25rem]`}></div>
      </div>
      <div 
        className={`
          ${myBoard ? 'hidden' : ''}
          grid grid-cols-2 md:grid-cols-3
        `}
      >
        {likedProducts?.map((product: any, key) => (
          <ProductCard key={key} product={product}/>
        ))}
        <div ref={likedRef} className={`${isFirstLikedLoadRef.current ? 'hidden' : 'block'} h-[0.25rem]`}></div>
      </div>
    </div>
  )
}

export default UProduct