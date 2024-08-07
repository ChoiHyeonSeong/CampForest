import React, { useState, useEffect, useCallback } from 'react'
import SearchProfile, { profileType } from '@components/Search/SearchProfile'
import { nicknameSearch } from '@services/userService';
import NoResultSearch from '@components/Search/NoResultSearch'

type Props = {
  nickname: string;
}

const SearchProfileList = (props: Props) => {
  const [profileList, setProfileList] = useState<profileType[]>([]);

  const fetchProfileList = useCallback(async () => {
    const result = await nicknameSearch(props.nickname);
    const list = result.users
    const size = result.size
    
    if (list && Array.isArray(list)) {
      // 정확히 일치하는 결과만 필터링하게 하기
      const filteredResults = list.filter(profile => 
        profile.nickname.includes(props.nickname)
      );
      setProfileList(filteredResults);
    } else {
      setProfileList([]);
    }
  }, [props.nickname]);


  useEffect(() => {
    fetchProfileList();
  }, [fetchProfileList]);

  return (
    <div>
      <p className='font-medium text-lg md:text-xl'>
        프로필
        <span className='ms-[0.5rem] font-bold'>
          {profileList.length}
        </span>
      </p>

      {profileList.length > 0 ? 
        profileList.map((profile) => (
          <SearchProfile profile={profile} />  
        )) :
      <NoResultSearch />
      }
    </div>
  )
}

export default SearchProfileList