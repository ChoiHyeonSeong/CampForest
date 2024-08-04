import React from 'react'
import SearchBoard from '@components/Search/SerarchBoard'

type Props = {}

const SearchBoardList = (props: Props) => {
  return (
    <div>
      <p className='font-medium text-lg'>커뮤니티<span className='ms-[0.5rem] font-bold'>90</span></p>
      <SearchBoard />  
    </div>
  )
}

export default SearchBoardList