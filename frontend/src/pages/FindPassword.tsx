import PasswordChange from '@components/User/PasswordChange';
import PasswordRequest from '@components/User/PasswordRequest';
import React, { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom';

const FindPassword = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (isLoggedIn === null || isLoggedIn === "false") {
      navigate("/");
    }
  }, [])

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