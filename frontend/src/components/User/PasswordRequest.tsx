import React from 'react';
import { ReactComponent as LeftArrow } from '@assets/icons/arrow-left.svg'

const PasswordRequest = () => {
  return (
    <div className={`lg:w-[40rem] md:max-w-[48rem] md:mt-[10rem] mx-auto p-[1.5rem] lg:p-0`}>
      <div 
        className={`
          max-md:flex items-center mb-[3rem] pb-[0.75rem]
          border-light-black
          dark:border-dark-black
          text-[1.5rem] md:text-[2rem] md:text-center
        `}
      >
        <LeftArrow 
          className={`md:hidden me-[1rem] fill-light-black dark:fill-dark-black`} 
        />
        <div>비밀번호 재설정</div>
      </div>
      <div className={`w-[25rem] mt-[40%] md:mt-[5rem] mx-auto`}>
        <div 
          className={`
            mb-[3rem] 
            selection:text-light-text-secondary 
            dark:selection:text-dark-text-secondary 
            -space-y-[0.25rem] max-md:text-sm text-center
          `}
        >
          <div>계정으로 사용하는 이메일 주소를 입력하시면</div>
          <div>비밀번호를 설정하실 수 있는 메일을 전송해드립니다.</div>
        </div>
        <div className={`text-center`}>
          <input 
            type='email' 
            placeholder='test@test.com' 
            className={`
              w-[100%] max-w-[23rem] py-[0.75rem] px-[1rem]
              bg-light-white border-light-black
              dark:bg-dark-white dark:border-dark-black
              rounded-md focus:outline-none border text-sm 
            `}
          />
          <div 
            className={`
              max-w-[23rem] mt-[1.5rem] mx-auto py-[0.75rem]
              bg-light-black text-light-text-white
              dark:bg-dark-black dark:text-dark-text-white
              text-sm cursor-pointer
            `}
          >
            비밀번호 재설정 메일 요청
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasswordRequest;