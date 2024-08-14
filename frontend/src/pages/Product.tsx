import React from 'react'
import ProductDetail from '@components/Product/ProductDetail';
import ProductList from '@components/Product/ProductList';
import { Route, Routes } from 'react-router-dom';
import ProductWrite from '@components/Product/ProductWrite';
import WriteReview from '@components/Product/WriteReview';
import ProductModify from '@components/Product/ProductModify';

const Product = () => {
  return (
    <Routes>
      <Route path='/list/:category' element={<ProductList />} />
      <Route path='/detail/:productId' element={<ProductDetail />} />
      <Route path='/detail/:productId/modify' element={<ProductModify />} />
      <Route path='/write' element={<ProductWrite />} />
      <Route path='/write/review' element={<WriteReview  />} />
     </Routes>
  )
}

export default Product;