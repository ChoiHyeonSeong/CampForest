import React from 'react'

import { ReactComponent as LeftArrow } from '@assets/icons/arrow-left.svg'

type Props = {
  isExtendMenuOpen: boolean;
  toggleExtendMenu: (param:string) => void;
}

const NavbarLeftExtendCommunity = (props: Props) => {
  return (
    <div
      className={`fixed w-[25rem] h-full md:mt-11 lg:mt-0 mb-11 md:mb-0 
        transition-all duration-300 ease-in-out 
        ${props.isExtendMenuOpen ? 'translate-x-[5rem]' : '-translate-x-full'} 
        bg-white outline outline-1 outline-[#CCCCCC]`
      }
    >
      <div className='h-20 ps-4 flex items-center'>
        <LeftArrow className='me-3 cursor-pointer w-5 h-5' onClick={() => props.toggleExtendMenu('community')}/>
        <p className='text-2xl'>커뮤니티</p>
      </div>
      <div className='flex flex-col text-left ps-10'>
        <div className="p-6">전체보기</div>
        <div className="p-6">캠핑장 후기</div>
        <div className="p-6">캠핑장비 후기</div>
        <div className="p-6">레시피 추천</div>
        <div className="p-6">캠핑장 양도</div>
        <div className="p-6">자유게시판</div>
        <div className="p-6">질문게시판</div>
      </div>
    </div>
  )
}

export default NavbarLeftExtendCommunity