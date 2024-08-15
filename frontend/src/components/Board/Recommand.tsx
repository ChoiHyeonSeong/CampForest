import React from 'react'
import RecommandUser from './RecommandUser';
import { SimilarUserType } from '@store/userSlice';

const Recommand = () => {
  const similarUsers = JSON.parse(sessionStorage.getItem('similarUsers')!)
  return (
    <div 
      className={`
        mt-[1rem] p-[1rem]
        border-light-border bg-light-white bg-opacity-60
        dark:border-dark-border dark:bg-light-white dark:bg-opacity-60
        border rounded-md
      `}
    >
      {/* 사용자 추천 */}
      <div 
        className={`
          border-light-border
          dark:border-dark-border
        `}
      >
        <div className={`ms-[0.5rem] mb-[0.5rem] font-semibold`}>
          사용자 추천
        </div>
        <div className={`grid grid-cols-4 gap-[0.5rem]`}>
          {similarUsers.map((similarUser: SimilarUserType, index: number) => (
            <div key={index}>
              <RecommandUser userInfo={similarUser} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Recommand;