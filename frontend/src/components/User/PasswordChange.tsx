import React from 'react';
import { ReactComponent as LeftArrow } from '@assets/icons/arrow-left.svg'

const PasswordChange = () => {
  return (
    <div className='lg:w-[40rem] md:max-w-[48rem] mx-auto md:mt-[10rem] p-[1.5rem] lg:p-0'>
      <div
        className={`
          max-md:flex items-center pb-[0.75rem] mb-[3rem]
          md:text-center text-[1.5rem] md:text-[2rem]
        `}
      >
        <LeftArrow
          className={`
            md:hidden me-[1rem]
            fill-light-border-icon
            dark:fill-dark-border-icon
          `}
        />
        <div>비밀번호 변경</div>
      </div>

      {/* 비밀번호재설정 큰 부모 */}
      <div className='w-[25rem] mx-auto mt-[25%] md:mt-[5rem] px-[1rem]'>
        <div
          className={`
            flex mb-[1rem]
            text-light-text 
            dark:text-dark-text
            text-sm
          `}
        >
          <div className='font-semibold'>ssafy123@test.com</div>
          <div>의 비밀번호를 변경합니다.</div>
        </div>
        <div className='text-center'>
          <input
            type='password'
            placeholder='새 비밀번호'
            className={`
               w-full max-w-[23rem] border mb-[1rem] px-[1rem] py-[0.75rem]
              bg-light-white border-light-border-3 
              dark:bg-dark-white dark:border-dark-border-3
              rounded-md focus:outline-none text-sm
            `}
          />
           <input
            type='password'
            placeholder='비밀번호 확인'
            className={`
               w-full max-w-[23rem] border mb-[1rem] px-[1rem] py-[0.75rem]
              bg-light-white border-light-border-3 
              dark:bg-dark-white dark:border-dark-border-3
              rounded-md focus:outline-none text-sm
            `}
          />

          <div
            className={`
              space-y-[1rem]
              text-light-text-secondary
              dark:text-dark-text-secondary
              text-sm font-semibold
            `}
          >
            <div className='flex items-center'>
              <div
                className={`
                  size-[0.5rem] me-[0.5rem]
                  bg-light-heart
                  dark:bg-dark-heart
                  rounded-full
                `}
              />
              <div
                className={`
                  text-light-text-secondary 
                  dark:text-dark-text-secondary
                `}
              >
                최소 8자리 이상, 최대 16자리 이하
              </div>
            </div>
            <div className='flex items-center'>
              <div
                className={`
                  size-[0.5rem] me-[0.5rem]
                  bg-light-heart
                  dark:bg-dark-heart
                  rounded-full
                `}
              />
              <div
                className={`
                  text-light-text-secondary 
                  dark:text-dark-text-secondary
                `}
              >
                영대소문자, 숫자, 특수문자 중 2종류 이상 포함
              </div>
            </div>            
          </div>
          <div
            className={`
              w-full max-w-[23rem] mt-[3.25rem] mx-auto py-[0.75rem] 
              bg-light-signature text-light-text-white
              dark:bg-dark-signature dark:text-dark-text-white
              text-sm md:text-base cursor-pointer
            
            `}
          >
            비밀번호 변경
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasswordChange;