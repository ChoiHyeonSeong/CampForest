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
    <div className={`lg:w-[40rem] md:max-w-[48rem] md:mt-[1rem] lg:mt-[3rem] mx-auto p-[1.5rem] lg:p-0`}>
      <div 
        className={`
          mb-[3rem] pb-[0.75rem]
          border-light-black text-light-text
          dark:border-dark-black dark:text-dark-text
          border-b-2 text-[2rem] text-center
        `}
      >
        회원가입
      </div>
      <Routes>
        <Route path='/' element={<Email />} />
        <Route path='/information' element={<Information />} />
      </Routes>
      {/* <div className='text-center'>
        <button 
          onClick={handleNextClick}
          className='w-[80%] md:mt-[3rem] border-2 border-black font-bold md:w-[20rem] md:rounded-none rounded-md h-[2.5rem] hover:bg-black hover:text-white transition-all duration-300'>
            다음
        </button>
      </div> */}
      <div className={`text-center`}>
        <button 
          onClick={handleNextClick}
          className={`
            w-[20rem] md:w-[11rem] h-[2.5rem] md:mt-[3rem]
            border-light-black hover:bg-light-black hover:text-light-text-white 
            dark:border-dark-black dark:hover:bg-dark-black dark:hover:text-dark-text-white
            border-2 md:rounded-none rounded-md transition-all duration-300 font-bold
          `}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default Regist;