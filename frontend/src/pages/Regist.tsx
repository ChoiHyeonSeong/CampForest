import React from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";
import Email from '@components/User/RegistEmail';
import Information from '@components/User/UserInformation';
import { RegistProvider, useRegistContext } from '@components/User/RegistContext';

const RegistContent: React.FC = () => {
  const { formData } = useRegistContext();
  const navigate = useNavigate();

  const handleNextClick = () => {
    // 여기에 유효성 검사 로직을 추가할 수 있습니다
    navigate('./information');
  };

  return (
    <div className='md:mt-[1rem] lg:mt-[3rem] mx-auto p-6 md:max-w-3xl lg:w-[40rem] lg:p-0'>
      <div className='text-center pb-[0.75rem] text-[2rem] border-b-2 border-black mb-[3rem]'>
        회원가입
      </div>
      <Routes>
        <Route path='/' element={<Email />} />
        <Route path='/information' element={<Information />} />
      </Routes>
      <div className='text-center'>
        <button 
          onClick={handleNextClick}
          className='mt-[5rem] border-2 border-black font-bold w-[20rem] md:rounded-none rounded-md md:w-[11rem] h-[2.5rem] hover:bg-black hover:text-white transition-all duration-300'
        >
          다음
        </button>
      </div>
    </div>
  );
};

const Regist: React.FC = () => (
  <RegistProvider>
    <RegistContent />
  </RegistProvider>
);

export default Regist;