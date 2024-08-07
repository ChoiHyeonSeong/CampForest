import React, { useEffect } from 'react'
import ProductCard, { ProductType } from '@components/Product/ProductCard'

type Props = {
  product: ProductType[];
}

const SearchProduct = (props: Props) => {
  useEffect(() => {
    console.log(props.product);
  }, [])
  
  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:px-[0.5rem] py-[1.5rem]'>
      {props.product.map(product => (
        <ProductCard key={product.productId} product={product} />
      ))}
    </div>
  )
  
}

export default SearchProduct