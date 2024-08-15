import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as LeftArrow } from '@assets/icons/arrow-left.svg'

import axiosInstance, { userDelete, logout } from '@services/authService';

import Swal from 'sweetalert2'

const UserDelete = () => {
  const [isNicknameMatched, setIsNicknameMatched] = useState(true)
  const [currentNickname, setCurrentNickname] = useState('');
  const [inputNickname, setInputNickname] = useState('');

  useEffect(() => {
    const nickname = sessionStorage.getItem('nickname')
    if (nickname !== null) {
      setCurrentNickname(nickname)
    } else {
      setCurrentNickname('닉네임 조회 불가')
    }
  }, [])

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  const successAlert = (message: string) => {
    Swal.fire({
      text: message,
      icon: "success"
    });
  }

  const errorAlert = (message: string) => {
    Swal.fire({
      text: message,
      icon: "error"
    });
  }
  
  const requestDelete = async () => {
    if (currentNickname === inputNickname) {
      const result = await userDelete()
      if (result.data.status === 'C000') {
         // 토큰 제거
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('nickname');
        sessionStorage.removeItem('profileImage');
        sessionStorage.removeItem('similarUsers');
        sessionStorage.removeItem('isLoggedIn');
        delete axiosInstance.defaults.headers['Authorization'];
        successAlert('회원탈퇴가 완료되었습니다.')
        navigate('/')
      } else {
        errorAlert('회원탈퇴를 실패했습니다. 다시 시도해주세요.')
      }
    } else {
      setIsNicknameMatched(false)
    }
  }

  useEffect(() => {
    setIsNicknameMatched(true)
  }, [inputNickname])

  return (
    <div
    className='
      flex justify-center md:items-center w-full h-[calc(100vh-6.4rem)] sm:h-[calc(100vh-3.2rem)] lg:h-screen
      bg-light-white bg-opacity-80 md:bg-transparent md:bg-opacity-0
      dark:bg-dark-white dark:bg-opacity-80 md:dark:bg-transparent md:dark:bg-opacity-0
    '
    >
      <div
        className={`
          w-[90%] md:w-[44rem] h-fit md:p-[3rem]
          md:bg-light-white md:bg-opacity-80
          md:dark:bg-dark-white md:dark:bg-opacity-80
          rounded
        `}>
        {/* 비밀번호 재설정 텍스트 */}
        <div 
          className={`
            max-md:flex items-center max-md:py-[1rem]
            border-light-black
            dark:border-dark-black
            text-[1.5rem] md:text-[2rem] md:text-center
          `}
        >
          <LeftArrow
            onClick={handleGoBack}
            className={`
              md:hidden me-[1rem]
              fill-light-border-icon
              dark:fill-dark-border-icon
            `} 
          />
          <div className='hidden md:block'>회원 탈퇴</div>
        </div>

        {/* 비밀번호 설정부모 */}
        <div className={`w-full mt-[40%] md:mt-[4.5rem]`}>
          <div 
            className={`
              mb-[3rem] 
              selection:text-light-text
              dark:selection:text-dark-text
              -space-y-[0.25rem] text-center
            `}
          >
            <div>회원 탈퇴를 원하시면 닉네임을 입력해주세요.</div>
          </div>
          <div className={`text-center`}>
            <input 
              type='email' 
              placeholder={currentNickname}
              className={`
                w-[100%] max-w-[30rem] py-[0.75rem] px-[1rem]
                bg-light-gray
                dark:bg-dark-gray
                rounded-md focus:outline-none text-sm 
              `}
              value={inputNickname}
              onChange={(event) => {
                setInputNickname(event.target.value);
              }}
            />
            <div 
              className={`
                ${isNicknameMatched ? 'hidden' : 'block'}
                my-[0.25rem]
                text-light-warning
                dark:text-dark-warning
                text-xs 
              `}
            >
              닉네임이 다릅니다. 다시 입력해주세요.
            </div>
            <div 
              onClick={requestDelete}
              className={`
                w-[100%] max-w-[30rem] mt-[1.5rem] mx-auto py-[0.75rem]
                bg-light-black text-light-text-white hover:bg-light-warning
                dark:bg-dark-black dark:text-dark-text-white dark:hover:bg-light-warning
                text-sm cursor-pointer transition-colors duration-300
              `}
            >
              회원 탈퇴
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDelete