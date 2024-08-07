import React, { useState, useEffect, useRef } from 'react'
import ProductCard, { ProductType } from '@components/Product/ProductCard';

import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useInView } from 'react-intersection-observer';

import { productList } from '@services/productService';
import { setIsLoading } from '@store/modalSlice';


type Props = {}

const UProduct = (props: Props) => {
  const userId = Number(useParams().userId);
  const dispatch = useDispatch();

  const [ref, inView] = useInView();

  const [products, setProducts] = useState<ProductType[]>([]);
  const [nextPageExist, setNextPageExist] = useState(true);
  
  const isFirstLoadRef = useRef(true);
  const productPageRef = useRef(0);

  const fetchProducts = async (reset = false) => {
    try {
      if (reset) {
        productPageRef.current = 0
        setProducts([]);
        setNextPageExist(true);
      }
      
      dispatch(setIsLoading(true));
      const response = await productList({userId: userId, productType: ''});
      dispatch(setIsLoading(false));

      if (response.data) {
        productPageRef.current += 1;
        if (response.data) {
          setNextPageExist(false);
        }
        if(reset) {
          isFirstLoadRef.current = false;
        }
        setProducts((prevProducts) => [...prevProducts, ...response.products]);
      }
    } catch (error) {
      console.error("Failed to fetch products: ", error);
    }
  }

  useEffect(() => {
    // inView가 true일 때만 실행한다.
    if (inView && nextPageExist) {
      console.log(inView, '무한 스크롤 요청');
      fetchProducts();
    }
  }, [inView]);

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3`}>
      {/* {products?.content.map((product: any) => (
        <ProductCard product={product}/>
      ))} */}
    </div>
  )
}

export default UProduct