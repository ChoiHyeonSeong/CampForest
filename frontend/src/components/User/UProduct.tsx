import React, { useState, useEffect, useRef } from 'react'

import { ReactComponent as ArticleIcon } from '@assets/icons/article-outline.svg';
import { ReactComponent as Heart } from '@assets/icons/heart.svg';
import { ReactComponent as FilterIcon } from '@assets/icons/filter2.svg';

import ProductCard, { ProductType } from '@components/Product/ProductCard';

import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useInView } from 'react-intersection-observer';

import { likedList, productList } from '@services/productService';
import { RootState } from '@store/store';

import { setIsLoading } from '@store/modalSlice';

type Props = {}

type ContentType = {
  createdAt: string;
  id: number;
  product: ProductType
  userId: number;
}

const UProduct = (props: Props) => {
  const dispatch = useDispatch();
  const [myBoard, setMyBoard] = useState(true);
  const userId = Number(useParams().userId);
  const userState = useSelector((state: RootState) => state.userStore);
  const [ref, inView] = useInView();

  const [products, setProducts] = useState<ProductType[]>([]);
  const [nextPageExist, setNextPageExist] = useState(true);

  const productCursorRef = useRef<number | null>(null);

  const [totalProductCnt, setTotalProductCnt] = useState(0);
  const [totalLikedProductCnt, setTotalLikedProductCnt] = useState(0);


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
          productType: '',
          findUserId: userId,
          cursorId: productCursorRef.current,
          size: 20,
        });
      } else {
        result = await productList({
          productType: '',
          findUserId: userId,
          size: 20,
        });
      }
      
      console.log(result)
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


  const fetchLikedProducts = async () => {
    try {
      dispatch(setIsLoading(true));
      let result: {
        hasNext: boolean, 
        nextCursorId: number | null, 
        content: ContentType[],
        totalCount: number,
      }

      if (productCursorRef.current !== null) {
        result = await likedList({
          cursorId: productCursorRef.current,
          size: 20,
        });
      } else {
        result = await likedList({
          size: 20,
        });
      }
      
      console.log(result)
      dispatch(setIsLoading(false));
      productCursorRef.current = result.nextCursorId;
      if (!result.hasNext) {
        setNextPageExist(false);
      }
      setProducts((prevProducts) => [...prevProducts, ...result.content.map(item => item.product)]);
    } catch (error) {
      dispatch(setIsLoading(false));
      console.error('판매/대여 게시글 불러오기 실패: ', error);
    }
  };


  useEffect(() => {
    // inView가 true일 때만 실행한다.
    if (inView && nextPageExist) {
      console.log(inView, '작성글 무한 스크롤 요청');
      if (myBoard) {
        console.log(123)
        fetchProducts();
      } else {
        console.log(456)
        fetchLikedProducts();
      }
    }
  }, [inView]);

  const pageReload = (isLiked: boolean = true) => {
    productCursorRef.current = null
    setProducts([]);
    setNextPageExist(true);
    if (isLiked) {
      fetchLikedProducts();
    } else {
      fetchProducts();
    }
  };

  useEffect(() => {
    if (myBoard) {
      pageReload(false)
    } else {
      pageReload(true)
    }
  }, [myBoard])

  const getCnt = async () => {
    const response1 = await productList({
      productType: '',
      findUserId: userId,
      size: 1,
    });
    console.log(userState.userId , userId)
    if (userState.userId === userId) {
      const response2 = await likedList({
        size: 1,
      }); 
      console.log(response2)
      setTotalLikedProductCnt(response2.totalCount)
    }
    setTotalProductCnt(response1.totalCount)
  }

  useEffect(() => {
    console.log(123)
    getCnt()
  }, [userId, userState.userId])

  const likedTrigger = (isLiked: boolean) => {
    if (isLiked) {
      setTotalLikedProductCnt(totalLikedProductCnt + 1)
    } else {
      setTotalLikedProductCnt(totalLikedProductCnt - 1)
    }
  }

  return (
    <div>
      <div>
        {/* 작성글, 저장됨, 필터 */}
        <div
          className={`
            flex justify-center relative mt-[1.5rem] mb-[1.5rem]
          `}
        >
          {/* 작성글 */}
          <div
            onClick={() => setMyBoard(true)}
            className={`
              ${myBoard ? 'font-bold' : 'text-light-text-secondary'}
              flex items-center
            `}
          >
            <ArticleIcon 
              className={`
                ${myBoard ? 'fill-light-black dark:fill-dark-black' : 'fill-light-gray-1 dark:fill-dark-gray-1'}
                size-[1rem]
              `}
            />
            <span
              className={`
                ms-[0.5rem]
                text-[0.875rem]
              `}
            >
              작성글 {totalProductCnt}
            </span>
          </div>
          {/* 북마크 */}
          <div 
            onClick={() => setMyBoard(false)}
            className={`
            ${userId !== userState.userId ? 'hidden' : ''}
              flex items-center ms-[2.5rem]
            `}
          >
            <Heart 
              className={`
                ${myBoard ? 'fill-light-gray-1 dark:fill-dark-gray-1' : 'fill-light-black dark:fill-dark-black'}
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
              관심 {totalLikedProductCnt}
            </span>
          </div>
          {/* 필터 */}
          {/* <div className="flex justify-end absolute right-0">
            <div className="flex items-center ms-auto me-[4rem] px-[0.5rem] text-sm">
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
          </div> */}

        </div>
      </div>
      <div 
        className={`
          grid grid-cols-2 md:grid-cols-3
        `}
      >
        {products?.map((product: any, key) => (
          <ProductCard key={key} product={product} likedTrigger={likedTrigger}/>
        ))}
        <div ref={ref} className={`${products.length >= 1 ? 'block' : 'hidden'} h-[0.25rem]`}></div>
      </div>
    </div>
  )
}

export default UProduct