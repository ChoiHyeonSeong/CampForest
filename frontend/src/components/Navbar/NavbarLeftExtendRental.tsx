import React from 'react'

import EachCategory from './EachCategory';

import { ReactComponent as LeftArrow } from '@assets/icons/arrow-left.svg'
import campfire from '@assets/images/campfire.png'

type Props = {
  isExtendMenuOpen: boolean;
  toggleExtendMenu: (param:string) => void;
}

const NavbarLeftExtendRental = (props: Props) => {
  return (
    <div
      className={`fixed w-[25rem] h-full md:mt-11 lg:mt-0 mb-11 md:mb-0 
        transition-all duration-300 ease-in-out 
        ${props.isExtendMenuOpen ? 'translate-x-[5rem]' : '-translate-x-full'} 
        bg-white outline outline-1 outline-[#CCCCCC]`
      }
    >
      <div className='h-20 ps-4 flex items-center'>
        <LeftArrow className='me-3 cursor-pointer w-5 h-5' onClick={() => props.toggleExtendMenu('rental')}/>
        <p className='text-2xl'>판매 / 대여</p>
      </div>
      <div className='h-screen overflow-y-auto scrollbar-hide p-2 mx-10'>
        <div className="grid grid-cols-2 gap-4">
          <EachCategory title={"전체"} imgsrc={campfire} imgBgColor={'bg-green-500'} imgWd='w-24 h-24'/>
          <EachCategory title={"텐트"} imgsrc={campfire} imgBgColor={'bg-green-500'} imgWd='w-24 h-24'/>
          <EachCategory title={"의자"} imgsrc={campfire} imgBgColor={'bg-green-500'} imgWd='w-24 h-24'/>
          <EachCategory title={"침낭/매트"} imgsrc={campfire} imgBgColor={'bg-green-500'} imgWd='w-24 h-24'/>
          <EachCategory title={"테이블"} imgsrc={campfire} imgBgColor={'bg-green-500'} imgWd='w-24 h-24'/>
          <EachCategory title={"랜턴"} imgsrc={campfire} imgBgColor={'bg-green-500'} imgWd='w-24 h-24'/>
          <EachCategory title={"코펠/식기"} imgsrc={campfire} imgBgColor={'bg-green-500'} imgWd='w-24 h-24'/>
          <EachCategory title={"안전용품"} imgsrc={campfire} imgBgColor={'bg-green-500'} imgWd='w-24 h-24'/>
          <EachCategory title={"버너/화로"} imgsrc={campfire} imgBgColor={'bg-green-500'} imgWd='w-24 h-24'/>
          <EachCategory title={"기타"} imgsrc={campfire} imgBgColor={'bg-green-500'} imgWd='w-24 h-24'/>
        </div>
      </div>
    </div>
  )
}

export default NavbarLeftExtendRental