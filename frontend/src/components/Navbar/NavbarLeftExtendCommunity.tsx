import React from 'react'
import { Link } from 'react-router-dom';

import { ReactComponent as LeftArrow } from '@assets/icons/arrow-left.svg'

type Props = {
  isExtendMenuOpen: boolean;
  toggleExtendMenu: (param:string) => void;
  closeMenu: () => void;
}

type CommunityCategoryObj = {
  title: string;
  path: string;
}

const NavbarLeftExtendCommunity = (props: Props) => {
  const communityCategory: CommunityCategoryObj[] = [
    {
      title: '전체보기',
      path: 'all'
    },
    {
      title: '캠핑장 후기',
      path: 'place'
    },
    {
      title: '장비 후기',
      path: 'equipment'
    },
    {
      title: '레시피 추천',
      path: 'recipe'
    },
    {
      title: '캠핑장 양도',
      path: 'assign'
    },
    {
      title: '자유게시판',
      path: 'free'
    },
    {
      title: '질문게시판',
      path: 'question'
    },
  ]

  return (
    <div
      className={`fixed z-[35] w-[20rem] h-full pt-[3.2rem] 
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
          <Link key={index} to={`/community/${eachObj.path}`} onClick={props.closeMenu}>
            <div className="p-6">{eachObj.title}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default NavbarLeftExtendCommunity