import React, { useState, useEffect, useCallback } from 'react'
import SearchProfile, { profileType } from '@components/Search/SearchProfile'
import { nicknameSearch } from '@services/userService';
import NoResultSearch from '@components/Search/NoResultSearch'

type Props = {
  searchText: string;
}

const SearchProfileList = (props: Props) => {
  const [profileList, setProfileList] = useState<profileType[]>([]);
  const [profileCount, setProfileCount] = useState(0);

  const fetchProfileList = useCallback(async () => {
    try {
      const result = await nicknameSearch(props.searchText, 10);
      console.log(result)
      if (result.users) {
        setProfileList(result.users);
      }
      if (result.totalCount) {
        setProfileCount(result.totalCount);
      }
    } catch (error) {
      console.log(error)
    }
  }, [props.searchText]);


  useEffect(() => {
    fetchProfileList();
  }, [fetchProfileList]);

  return (
    <div>
      <p className='font-medium text-lg md:text-xl'>
        프로필
        <span className='ms-[0.5rem] font-bold'>
          {profileCount}
        </span>
      </p>

      {profileList.length > 0 ? 
        profileList.map((profile) => (
          <SearchProfile profile={profile} />  
        )) :
      <NoResultSearch searchText={props.searchText} />
      }
    </div>
  )
}

export default SearchProfileList