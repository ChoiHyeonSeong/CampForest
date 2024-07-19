import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login, logout } from '@store/authSlice'

const DarkmodeBtn = () => {
  const [isDarkmode, setIsDarkmode] = useState<boolean>(false)

  const toggleDarkmode = (): void => {
    setIsDarkmode(!isDarkmode)

    // 테스트용 임시
    if (!isDarkmode) {
      dispatch(login({
        user: "user입니다",
        key: "임시key입니다"
      }))
    } else {
      dispatch(logout())
    }
  }

  // 테스트용 임시
  const dispatch = useDispatch();

  return (    
    <div className='bg-black w-16 h-5 rounded-3xl cursor-pointer' onClick={toggleDarkmode}>
      <div className={`bg-green-500 w-10 h-5 rounded-3xl transition-all duration-300
        ${isDarkmode ? 'translate-x-6' : '-translate-x-0'}`}
      />
    </div>
  )
}

export default DarkmodeBtn