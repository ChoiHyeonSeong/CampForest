import PasswordChange from '@components/User/PasswordChange';
import PasswordRequest from '@components/User/PasswordRequest';
import React from 'react'
import { Route, Routes } from 'react-router-dom';

const FindPassword = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<PasswordRequest />} />
        <Route path='/change' element={<PasswordChange />} />
      </Routes>
    </div>
  )
}

export default FindPassword;