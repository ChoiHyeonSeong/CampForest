import React from 'react'
import { Link } from "react-router-dom";
import { ReactComponent as LeftArrow } from '@assets/icons/arrow-left.svg'
import UserInformation from '@components/User/UserInformation'

type Props = {}

const ProfileEdit = (props: Props) => {
  return (
    <div className={`md:w-[40rem] md:mt-[1rem] lg:mt-[3rem] mb-[2.5rem] mx-auto p-[1.5rem] lg:p-0`}>
      <div 
        className={`
          flex items-center md:justify-center mb-[0.75rem] md:mb-[2.5rem] pb-[0.75rem] 
          border-light-black text-light-text
          dark:border-dark-black dark:text-dark-text
          md:text-[2rem] md:border-b-2
        `}
      >
        <LeftArrow 
          className={`md:hidden w-[1.25rem] h-[1.25rem] me-[0.75rem] 
            fill-light-black 
            dark:fill-dark-black
            cursor-pointer
          `}
        />
        <div className={`max-md:text-[1.5rem]`}>프로필 수정</div>
      </div>
      <UserInformation />

      {/* 비밀번호 변경하기 */}
      <Link to='/user/password'>
        <div className={`text-light-anchor dark:text-dark-anchor font-md font-medium cursor-pointer`}>비밀번호 변경하기</div>
      </Link>
      

      {/* 완료 버튼 */}
      <div className={`text-center`}>
        <button 
          className={`
            w-[20rem] md:w-[11rem] h-[2.5rem] md:mt-[3rem]
            border-light-black hover:bg-light-black hover:text-light-text-white 
            dark:border-dark-black dark:hover:bg-dark-black dark:hover:text-dark-text-white
            border-2 md:rounded-none rounded-md transition-all duration-300 font-bold 
          `}
        >
          완료
        </button>
      </div>
    </div>
  )
}

export default ProfileEdit