import React, { useState, useEffect } from 'react'
import SearchProfile, { profileType } from '@components/Search/SearchProfile'
import { nicknameSearch } from '@services/userService';

type Props = {
  nickname: string;
}

const SearchProfileList = (props: Props) => {
  const [profileList, setProfileList] = useState<profileType[]>([]);

  const fetchProfileList = async () => {
    const result = await nicknameSearch('gim')
    setProfileList(result)
  }

  useEffect(() => {
    fetchProfileList();
  }, [])

  return (
    <div>
      <p className='font-medium text-lg md:text-xl'>프로필<span className='ms-[0.5rem] font-bold'>10</span></p>
      {profileList.map((profile) => (
        <SearchProfile profile={profile} />  
      ))}
    </div>
  )
}

export default SearchProfileList