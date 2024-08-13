import React, { useEffect, useState } from 'react'

import KakaoIcon from '@assets/icons/kakao.png'
import NaverIcon from '@assets/icons/naver.png'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '@services/authService'
import { setUser } from '@store/userSlice'
import { useDispatch } from 'react-redux'

import { kakaoLogin, naverLogin } from '@services/authService'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginFailed, setIsLoginFailed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      dispatch(setUser(data.user));
      // console.log('Login successful');
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoginFailed(true);
    }
  };

  useEffect(() => {
    setIsLoginFailed(false);
  }, [email, password])

  return (
    <div className={`flex justify-center items-center w-full min-h-screen`}>
      <div
        className={`
          w-[100%] h-screen md:h-fit md:max-w-[42rem] p-[2rem]
          bg-light-white bg-opacity-80
          dark:bg-dark-white dark:bg-opacity-80
          md:rounded
        `}
      >
        <h3
          className={`
            pb-[0.75rem] mb-[2.5rem]
            text-[2rem] text-center font-medium
          `}
        >
          로그인
        </h3>

        <p className={`${isLoginFailed ? 'block' : 'hidden'} mb-[2.5rem] text-light-warning dark:text-dark-warning text-center whitespace-pre-line`}>
          {'로그인에 실패했습니다\n아이디 / 비밀번호를 다시확인해주세요.'}
        </p>
        {/* 로그인 폼 */}
        <form onSubmit={handleLogin}>
          {/* 이메일 */}
          <div className={`mb-[1.5rem]`}>
            <label
              htmlFor="email"
              className={`
                block mb-[0.5rem]
                text-light-text placeholder:text-light-text-secondary
                dark:text-dark-text dark:placeholder:text-dark-text-secondary
                text-left
              `}
            >
              이메일
            </label>
            <input 
              type="email" 
              className={`
                w-[100%] px-[1rem] py-[0.5rem] 
                bg-light-white border-light-border
                dark:bg-dark-white dark:border-dark-border 
                border-b focus:outline-none rounded-md
              `} 
              placeholder="이메일을 입력하세요."
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* 비밀번호 */}
          <div className="mb-2">
            <label 
              htmlFor="password" 
              className={`
                block mb-[0.5rem]
                text-light-text placeholder:text-light-text-secondary
                dark:text-dark-text dark:placeholder:text-dark-text-secondary
                text-left
              `}
            >
              비밀번호
            </label>
            <input 
              type="password" 
              id="password"
              name="userPassword"
              className={`
                w-[100%] px-[1rem] py-[0.5rem]
                bg-light-white border-light-border
                dark:bg-dark-white dark:border-dark-border 
                border-b focus:outline-none rounded-md
              `} 
              placeholder="비밀번호를 입력하세요." 
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* 비밀번호 잊으셨나요? */}
          <div className={`flex justify-between items-center mb-[1.5rem] md:mb-[2.5rem]`}>
            <a href="/user/password" className={`w-[100%] text-light-anchor dark:text-dark-anchor text-sm text-right font-medium`}>비밀번호를 잊으셨나요?</a>
          </div>
          <button 
            type="submit" 
            className={`
              w-[100%] py-[0.5rem]
              bg-light-black text-light-text-white
              dark:bg-dark-black dark:text-dark-text-white
              rounded-lg duration-200
            `}
          >
            Login
          </button>
        </form>

        {/* 회원가입 하세요 */}
        <div className={`mt-[1rem] text-center`}>
          <p className={`text-light-text-secondary dark:text-dark-text-secondary`}>아직 회원이 아니신가요? 
            <Link to='/user/regist'>
              <span className={`text-light-anchor dark:text-dark-anchor font-medium cursor-pointer`}> 회원가입하세요!</span>
            </Link>
          </p>
        </div>

        {/* 소셜 로그인 */}
        <div className={`md:flex md:justify-center mt-[2.5rem] md:space-x-4`}>
          <button 
            onClick={kakaoLogin}
            className={`
              flex flex-all-center w-[50%] max-md:w-[100%] max-md:mb-[1rem] py-[0.5rem] px-[1rem]
              bg-[#FEE500] text-black
              rounded-lg 
            `}
          >
            <img src={KakaoIcon} alt="카카오톡 로그인" className={`size-[1rem] mr-[1rem]`}/>
            <p>카카오로 로그인</p>
          </button>
          <button 
            onClick={naverLogin}
            className={`
              flex flex-all-center w-[50%] max-md:w-[100%] py-[0.5rem] px-[1rem]
              bg-[#03C75A] text-white 
              rounded-lg
            `}
          >
            <img src={NaverIcon} alt="네이버 로그인" className={`size-[1rem] mr-[1rem]`}/>
            <p>네이버로 로그인</p>
          </button>
        </div>

      </div>
      
    </div>
  )
}

export default Login