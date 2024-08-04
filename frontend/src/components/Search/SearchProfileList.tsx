import React from 'react'
import SearchProfile from '@components/Search/SearchProfile'

type Props = {}

const SearchProfileList = (props: Props) => {
  return (
    <div>
      <p className='font-medium text-lg'>프로필<span className='ms-[0.5rem] font-bold'>10</span></p>
      <SearchProfile />  
    </div>
  )
}

export default SearchProfileList