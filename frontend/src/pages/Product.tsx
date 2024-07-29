import React from 'react'
import Detail from '@components/Product/Detail';
import ProductList from '@components/Product/ProductList';
import { Route, Routes } from 'react-router-dom';
import ProductWrite from '@components/Product/ProductWrite';

const Product = () => {
  return (
    <Routes>
      <Route path='/' element={<ProductList />} />
      <Route path='/detail' element={<Detail />} />
      <Route path='/write' element={<ProductWrite />} />
    </Routes>
  )
}

export default Product;