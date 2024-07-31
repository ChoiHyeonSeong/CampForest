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
    <div className={`${isLoading ? 'hidden' : 'hidden'} z-[500] w-full h-screen bg-black bg-opacity-80 text-white top-0 left-0 flex flex-col items-center justify-center`}>
      {/* <WhiteLogoIcon className='mb-4' /> */}
      <div className='flex space-x-2 mb-4'>
        <div className='w-4 h-4 bg-gray-100 rounded-full animate-bounce'></div>
        <div className='w-4 h-4 bg-gray-300 rounded-full animate-bounce animation-delay-200'></div>
        <div className='w-4 h-4 bg-gray-500 rounded-full animate-bounce animation-delay-400'></div>
      </div>
      <div className='text-center'>
        <div className='text-lg mb-4'></div>
        마이페이지를 가져오는 중입니다.
      </div>
  </div>
  );
};

export default LoadingModal;