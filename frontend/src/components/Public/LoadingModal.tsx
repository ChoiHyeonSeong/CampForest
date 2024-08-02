import React, { useEffect } from 'react';
import { useSelector } from 'react-redux'
import { RootState } from '@store/store';

const LoadingModal= () => {
  const isLoading = useSelector((state: RootState) => state.modalStore.isLoading)

  useEffect(() => {
    const currentScrollY = window.scrollY;
    const contentBox = document.querySelector('#contentBox') as HTMLElement;
    
    if (isLoading) {
      // 모달이 열릴 때 스크롤 방지
      contentBox.classList.add('no-scroll');
      contentBox.style.top = `-${currentScrollY}px`;
    } else {
      // 모달이 닫힐 때 스크롤 허용
      const scrollY = parseInt(contentBox.style.top || '0') * -1;
      contentBox.style.top = '';
      contentBox.classList.remove('no-scroll');
      window.scrollTo(0, scrollY || currentScrollY);
    }
  }, [isLoading]);

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