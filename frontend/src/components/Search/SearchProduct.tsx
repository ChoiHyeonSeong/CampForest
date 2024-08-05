import React from 'react'
import ProductCard, { ProductType } from '@components/Product/ProductCard'
type Props = {}

const SearchProduct = (props: Props) => {
  const sampleProduct: ProductType = {
    category: 'electronics',
    deposit: null,
    hit: 123,
    imageUrl: 'path/to/image.jpg', // 실제 이미지 경로로 변경하세요
    interestHit: 45,
    location: 'Seoul',
    productId: 1,
    productName: 'Sample Product',
    productPrice: 10000,
    productType: 'SALE',
    sold: false,
    userId: 1,
  };

  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:px-[0.5rem] py-[1.5rem]'>
      <ProductCard product={sampleProduct} />
      <ProductCard product={sampleProduct} />
      <ProductCard product={sampleProduct} />
      <ProductCard product={sampleProduct} />
      <ProductCard product={sampleProduct} />
      <ProductCard product={sampleProduct} />
      <ProductCard product={sampleProduct} />
      <ProductCard product={sampleProduct} />
    </div>
  )
}

export default SearchProduct