import React from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";
import Email from '@components/User/RegistEmail';
import Information from '@components/User/UserInformation';

const Regist: React.FC = () => {
  const navigate = useNavigate();

  const handleNextClick = () => {
    navigate('./information')
  }

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

export default Regist;