import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as LeftArrow } from '@assets/icons/arrow-left.svg'

const PasswordChange = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };
  
  return (
    <div
      className='
        flex justify-center md:items-center w-full h-[calc(100vh-6.4rem)] sm:h-[calc(100vh-3.2rem)] lg:h-screen
        bg-light-white bg-opacity-80 md:bg-transparent md:bg-opacity-0
        dark:bg-dark-white dark:bg-opacity-80 md:dark:bg-transparent md:dark:bg-opacity-0        
      '
    >
      <div
        className={`
          w-[90%] md:w-[44rem] h-fit md:p-[3rem]
          md:bg-light-white md:bg-opacity-80
          md:dark:bg-dark-white md:dark:bg-opacity-80
          rounded
        `}
      >
        <div
          className={`
            max-md:flex items-center max-md:py-[1rem]
            border-light-black
            dark:border-dark-black
            text-[1.5rem] md:text-[2rem] md:text-center
          `}
        >
          <LeftArrow
            onClick={handleGoBack}
            className={`
              md:hidden me-[1rem]
              fill-light-border-icon
              dark:fill-dark-border-icon
              cursor-pointer
            `}
          />
          <div className='hidden md:block'>비밀번호 변경</div>
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
                bg-light-white
                dark:bg-dark-white 
                rounded-md focus:outline-none text-sm
              `}
            />
            <input
              type='password'
              placeholder='비밀번호 확인'
              className={`
                w-full max-w-[23rem] border mb-[1rem] px-[1rem] py-[0.75rem]
                bg-light-white
                dark:bg-dark-white
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
                bg-light-signature text-white
                dark:bg-dark-signature 
                text-sm md:text-base cursor-pointer
              
              `}
            >
              비밀번호 변경
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default PasswordChange;