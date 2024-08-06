import React, { useState, useEffect } from 'react'
import ProductCard from '@components/Product/ProductCard';

type Props = {}

const UProduct = (props: Props) => {
  // async function fetchProducts() {
  //   try {
  //     dispatch(setIsLoading(true));
  //     const productData = await productList({userId: userId});
  //     setProducts(productData);
  //   } catch (error) {
  //     console.error("Failed to fetch products: ", error);
  //   }
  // }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3`}>
      {/* {products?.content.map((product: any) => (
        <ProductCard product={product}/>
      ))} */}
    </div>
  )
}

export default UProduct