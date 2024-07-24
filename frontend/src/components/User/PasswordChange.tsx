import React from 'react';
import { ReactComponent as LeftArrow } from '@assets/icons/arrow-left.svg'

const PasswordChange = () => {
  return (
    <div className='md:mt-[10rem] mx-auto p-6 md:max-w-3xl lg:w-[40rem] lg:p-0'>
      <div className='max-md:flex items-center md:text-center pb-[0.75rem] text-[1.5rem] md:text-[2rem]  border-black mb-[3rem]'>
        <LeftArrow className='me-[1rem] md:hidden' />
        <div>비밀번호 변경</div>
      </div>
      <div className='mx-auto w-[25rem] mt-[25%] md:mt-[5rem] px-[1rem]'>
        <div className='flex text-sm text-[#777777] mb-[1rem]'>
          <div className='font-semibold'>ssafy123@test.com</div>
          <div>의 비밀번호를 변경합니다.</div>
        </div>
        <div className='text-center'>
          <input type='password' placeholder='새 비밀번호' className='text-sm border border-black py-[0.75rem] px-[1rem] rounded-md w-full max-w-[23rem] focus:outline-none mb-[1rem]'/>
          <input type='password' placeholder='비밀번호 확인' className='text-sm border border-black py-[0.75rem] px-[1rem] rounded-md w-full max-w-[23rem] focus:outline-none mb-[1rem]'/>
          <div className='text-sm text-[#777777] font-semibold space-y-[1rem] ps-[1rem]'>
            <div className='flex items-center space-x-[0.5rem]'>
              <div className='size-[0.5rem] rounded-full bg-red-500'></div>
              <div>최소 8자리 이상, 최대 16자리 이하</div>
            </div>
            <div className='flex items-center space-x-[0.5rem]'>
              <div className='size-[0.5rem] rounded-full bg-red-500'></div>
              <div>영대소문자, 숫자, 특수문자 중 2종류 이상 포함</div>
            </div>
          </div>
          <div className='mx-auto bg-black text-sm text-white py-[0.75rem] max-w-[23rem] mt-[3.5rem] cursor-pointer'>비밀번호 변경</div>
        </div>
      </div>
    </div>
  )
}

export default PasswordChange;