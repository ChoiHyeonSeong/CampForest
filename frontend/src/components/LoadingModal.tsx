import React from 'react';
import { ReactComponent as WhiteLogoIcon } from '@assets/logo/logo-darkmode.svg'


const LoadingModal= () => {
  return (

    <div className='hidden fixed z-[100] w-full h-screen bg-[#000000d5] text-white top-0 left-0 flex flex-col items-center justify-center'>
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