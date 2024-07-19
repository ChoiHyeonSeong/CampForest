import React from 'react';
import { Route, Routes } from "react-router-dom";
import Email from '@components/User/RegistEmail';
import Information from '@components/User/UserInformation';

const Regist = () => {

    return (
      <div className='md:mt-[1rem] lg:mt-[3rem] mx-auto p-6 md:max-w-3xl lg:w-[40rem] lg:p-0'>
          <div className='text-center pb-[0.75rem] text-[2rem] border-b-2 border-black'>
            회원가입
          </div>
          <Routes>
            <Route path='/' element={<Email />} />
            <Route path='/information' element={<Information />} />
          </Routes>

        </div>
    )
}

export default Regist