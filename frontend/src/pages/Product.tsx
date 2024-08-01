import React from 'react'
import ProductDetail from '@components/Product/ProductDetail';
import ProductList from '@components/Product/ProductList';
import { Route, Routes } from 'react-router-dom';
import ProductWrite from '@components/Product/ProductWrite';

const Product = () => {
  return (
    <Routes>
      <Route path='/list' element={<ProductList />} />
      <Route path='/detail/:productId' element={<ProductDetail />} />
      <Route path='/write' element={<ProductWrite />} />
    </Routes>
  )
}

export default Product;