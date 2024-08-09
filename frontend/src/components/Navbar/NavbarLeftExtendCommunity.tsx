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
      className={`
        ${props.isExtendMenuOpen ? 'translate-x-[5rem]' : '-translate-x-full'}
        fixed z-[35] w-[20rem] h-[100%] pt-[3.2rem] lg:pt-[0]
        bg-light-white border-light-border-1
        dark:bg-dark-white dark:border-dark-border-1
        border-r transition-all duration-300 ease-in-out
      `}
    >
      {/* 상단 */}
      <div className={`flex items-center h-[5rem] ps-[1rem]`}>
        <LeftArrow 
          onClick={() => props.toggleExtendMenu('community')}
          className={`
            w-[1.25rem] h-[1.25rem] me-[0.75rem] 
            fill-light-border-icon
            dark:fill-dark-border-icon
            cursor-pointer
          `}
        />
        <p className={`text-2xl`}>커뮤니티</p>
      </div>

      {/* 채팅방 카테고리 */}
      <div 
        className={`
          flex flex-col h-[calc(100vh-5rem)] ps-[1rem]
          overflow-y-auto scrollbar-hide text-left
        `}
      >
        {communityCategory.map((eachObj, index) => (
          <Link key={index} to={`/community/${eachObj.path}`} onClick={props.closeMenu}>
            <div
              className={`
                p-[1.5rem]
                hover:bg-light-gray 
                dark:hover:bg-dark-gray
                rounded-lg transition-colors
              `}
            >
              {eachObj.title}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default NavbarLeftExtendCommunity