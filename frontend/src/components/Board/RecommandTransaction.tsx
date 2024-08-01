import React from 'react'

import userImage from '@assets/logo192.png'

const RecommandTransaction = () => {
  return (
    <div className={`grid grid-cols-6 items-center`}>
      <img 
        src={userImage} 
        alt="NoImg" 
        className={`
          size-[2.5rem]
          border-light-border
          dark:border-dark-border
          border
        `}
      />
      <div 
        className={`
          col-span-3 ms-[0.75rem]
          text-sm
        `}
      >
        <div>
          노란색 텐트
        </div>
        <div className={`font-bold`}>
          1,000,000원
        </div>
      </div>
    </div>
  )
}

export default RecommandTransaction;