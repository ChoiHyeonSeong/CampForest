import React from 'react'

import { ReactComponent as LeftArrow } from '@assets/icons/arrow-left.svg'

type Props = {
  isExtendMenuOpen: boolean;
  toggleExtendMenu: (param:string) => void;
}

type CommunityCategoryObj = {
  title: string;
}

const NavbarLeftExtendCommunity = (props: Props) => {
  const communityCategory: CommunityCategoryObj[] = [
    {
      title: '전체보기'
    },
    {
      title: '캠핑장 후기'
    },
    {
      title: '캠핑장비 후기'
    },
    {
      title: '레시피 추천'
    },
    {
      title: '캠핑장 양도'
    },
    {
      title: '자유게시판'
    },
    {
      title: '질문게시판'
    },
  ]

  return (
    <div
      className={`fixed z-30 w-[25rem] h-full md:mt-11 lg:mt-0 mb-11 md:mb-0 
        transition-all duration-300 ease-in-out 
        ${props.isExtendMenuOpen ? 'translate-x-[5rem]' : '-translate-x-full'} 
        bg-white outline outline-1 outline-[#CCCCCC]`
      }
    >
      <div className='h-20 ps-4 flex items-center'>
        <LeftArrow className='me-3 cursor-pointer w-5 h-5' onClick={() => props.toggleExtendMenu('community')}/>
        <p className='text-2xl'>커뮤니티</p>
      </div>
      <div className='h-[calc(100vh-5rem)] overflow-y-auto scrollbar-hide flex flex-col text-left ps-10'>
        {communityCategory.map((eachObj, index) => (
          <div key={index} className="p-6">{eachObj.title}</div>
        ))}
      </div>
    </div>
  )
}

export default NavbarLeftExtendCommunity