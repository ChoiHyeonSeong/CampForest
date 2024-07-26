import React from 'react';
import { ReactComponent as LeftArrow } from '@assets/icons/arrow-left.svg'

const PasswordRequest = () => {
  return (
    <div className='md:mt-[10rem] mx-auto p-6 md:max-w-3xl lg:w-[40rem] lg:p-0'>
      <div className='max-md:flex items-center md:text-center pb-[0.75rem] text-[1.5rem] md:text-[2rem]  border-black mb-[3rem]'>
        <LeftArrow className='me-[1rem] md:hidden' />
        <div>비밀번호 재설정</div>
      </div>
      <div className='mx-auto w-[25rem] mt-[40%] md:mt-[5rem]'>
        <div className='-space-y-[0.25rem] max-md:text-sm text-center text-[#555555] mb-[3rem]'>
          <div>계정으로 사용하는 이메일 주소를 입력하시면</div>
          <div>비밀번호를 설정하실 수 있는 메일을 전송해드립니다.</div>
        </div>
        <div className='text-center'>
          <input type='email' placeholder='test@test.com' className='text-sm border border-black py-[0.75rem] px-[1rem] rounded-md w-full max-w-[23rem] focus:outline-none'/>
          <div className='mx-auto bg-black text-sm text-white py-[0.75rem] max-w-[23rem] mt-[1.5rem] cursor-pointer'>비밀번호 재설정 메일 요청</div>
        </div>
      </div>
    </div>
  )
}

export default PasswordRequest;