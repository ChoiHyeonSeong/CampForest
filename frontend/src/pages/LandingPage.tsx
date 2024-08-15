import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { ReactComponent as ArrowDown } from '@assets/icons/aorrow-down.svg'
import LogoWhite from '@assets/logo/logo-darkmode.svg'

const LandingPage = () => {
  

  return (
    <div className='fixed inset-0 w-screen h-screen z-[200] bg-landing-bg-sm md:bg-landing-bg bg-cover bg-center bg-no-repeat overflow-hidden'>
     
     {/* 어두운배경 */}
     <div className='size-full bg-[#424242] opacity-35'></div>

     {/* 로고 */}
     <div className='w-[12rem] fixed top-8 left-10'>
        <img src={LogoWhite} alt="로고이미지" />
     </div>

     {/* 중앙텍스트 */}
     <div className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[70%]'>
      {/* page1 */}
      <div  className='flex flex-col flex-all-center w-full h-full text-white '>
        <div className='text-xl mb-[2.5rem] font-mediu border-b-2 border-light-signature'>캠핑인을 위한 커뮤니티 서비스</div>
        <div className='text-5xl text-center font-bold'>
          <p className='mb-[0.75rem]'>잠자던 캠핑용품,</p>
          <p>새로운 시작이 되다.</p>
        </div>
      </div>

      {/* page2 */}

      {/* page3 */}

      {/* page4 */}
     </div>



     {/* 스크롤표시 */}
     <div className='flex flex-col justify-center fixed bottom-8 left-1/2 -translate-x-1/2 w-[4rem] h-fit'>
        <div className='flex flex-all-center rounded-full w-full h-10 border-2 border-light-border-1 mb-[0.5rem]'>
          <ArrowDown
            className='size-[1.3rem]'
          />
        </div>
        <p className='text-center text-white text-sm'>SCROLL</p>
     </div>

      {/* skip */}
      <div className='fixed bottom-10 right-12 border-[#eee] text-white bg-black bg-opacity-50 w-[4.5rem] h-[2.2rem] cursor-pointer border flex flex-all-center'>SKIP</div>

    </div>
  )
}

export default LandingPage