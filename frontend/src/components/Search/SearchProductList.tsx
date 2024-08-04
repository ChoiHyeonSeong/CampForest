import React from 'react'
import SearchProduct from '@components/Search/SearchProduct'

type Props = {}

const SearchProductList = (props: Props) => {
  return (
    <div>
      <p className='font-medium text-lg'>판매/대여<span className='ms-[0.5rem] font-bold'>79</span></p>
      <SearchProduct />
    </div>
  )
}

export default SearchProductList