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

  const productPageRef = useRef(0);

  const fetchProducts = async () => {
    try {
      dispatch(setIsLoading(true));
      const response = await productList({userId: userId, productType: ''});
      dispatch(setIsLoading(false));
      console.log(userId)
      console.log(response)

      productPageRef.current += 1;
      if (response.data) {
        setNextPageExist(false);
      }
      setProducts((prevProducts) => [...prevProducts, ...response.products]);
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
      {products?.map((product: any, index) => (
        <ProductCard key={index} product={product}/>
      ))}

      <div ref={ref} className={`h-[0.25rem]`}></div>
    </div>
  )
}

export default UProduct