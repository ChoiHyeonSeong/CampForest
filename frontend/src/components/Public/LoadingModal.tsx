import React from 'react';
import { useSelector } from 'react-redux'
import { RootState } from '@store/store';

const LoadingModal= () => {
  const isLoading = useSelector((state: RootState) => state.modalStore.isLoading)

  return (
    <div 
      className={`
        ${isLoading ? 'flex' : 'hidden'}
        flex flex-col items-center justify-center fixed top-0 left-0 z-[500] w-full h-screen 
        bg-light-black text-light-white bg-opacity-80
        dark:bg-dark-black dark:text-dark-white dark:bg-opacity-80
      `}
    >
      {/* <WhiteLogoIcon className='mb-4' /> */}
      <div className={`flex space-x-[0.5rem] mb-[1rem]`}>
        <div 
          className={`
            w-[1rem] h-[1rem]
            bg-gray-300
            rounded-full animate-bounce
          `}
        />
        <div 
          className={`
            w-[1rem] h-[1rem]
            bg-gray-300
            rounded-full animate-bounce
          `}
        />
        <div 
          className={`
            w-[1rem] h-[1rem]
            bg-gray-500
            rounded-full animate-bounce
          `}
        />
      </div>
      <div className={`text-center`}>
        <div 
          className={`
            mb-[1rem]
            text-lg
          `}
        ></div>
        로딩 중입니다.
      </div>
  </div>
  );
};

export default LoadingModal;