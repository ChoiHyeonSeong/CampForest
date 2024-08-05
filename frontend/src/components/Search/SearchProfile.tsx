import React from 'react'
export type profileType = {
  nickname: string;
}

type Props = {
  profile: profileType
}

const SearchProfile = (props: Props) => {
  return (
    <div className='flex justify-between items-center w-full px-[0.5rem] md:px-[1rem] py-[1.5rem] border-light-border-1 dark:border-dark-border-1 border-b'>
      <div className='flex items-center'>
        {/* 프로필 이미지 */}
        <div className='size-[2.9rem] md:size-[3.25rem] me-[0.5rem] rounded-full overflow-hidden border border-light-border-1'>
          <img src='' alt='프로필 이미지' className='size-full'></img>
        </div>

        {/* 프로필 상세 */}
        <div>
          <div className='md:text-lg font-medium'>{props.profile.nickname}</div>
          <div className='flex'>
            <div
              className='
                me-[0.5rem]
                text-light-text-secondary 
                dark:text-dark-text-secondary
                text-xs md:text-sm
                '
              >
                팔로워
                <span className='font-medium'>20</span>
            </div>
            <div
              className='
                me-[0.5rem]
                text-light-text-secondary 
                dark:text-dark-text-secondary
                text-xs md:text-sm
                '
              >
                작성글
                <span className='font-medium'>20</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 버튼 */}
      <div className='flex'>
        <button
          className='
            me-[0.3rem] md:me-[0.5rem] px-[0.5rem] py-[0.2rem] md:px-[0.8rem]  md:py-[0.4rem]
            bg-light-signature hover:bg-light-signature-hover text-light-white
            dark:bg-dark-signature dark:hover:bg-dark-signature-hover
            rounded-md text-sm md:text-base
            '
          >
            팔로우
        </button>
        <button
          className='
            px-[0.5rem] py-[0.2rem] md:px-[0.8rem]  md:py-[0.4rem]
            bg-light-gray-1 hover:bg-light-gray-2 text-light-text
            dark:bg-dark-gray-1 dark:hover:bg-dark-gray-2 dark:text-dark-text
            rounded-md text-sm md:text-base
            '
          >
            채팅
        </button>
      </div>
    </div>
  )
}

export default SearchProfile