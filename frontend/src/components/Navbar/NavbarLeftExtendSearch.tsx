import React from 'react'

import { ReactComponent as LeftArrow } from '@assets/icons/arrow-left.svg'
import { ReactComponent as SearchIcon } from '@assets/icons/nav-search.svg'
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg';

type Props = {
  isExtendMenuOpen: boolean;
  toggleExtendMenu: (param:string) => void;
}

const NavbarLeftExtendSearch = (props: Props) => {

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
      <div className={`flex items-center h-[5rem] ps-[1rem]`}>
        <LeftArrow 
          onClick={() => props.toggleExtendMenu('search')}
          className={`
            w-[1.25rem] h-[1.25rem] me-[0.75rem] 
            fill-light-black
            dark:fill-dark-black
            cursor-pointer
          `}
        />
        <p className={`text-2xl`}>검색</p>
      </div>

      <div className={`relative w-[calc(100%-3rem)] mx-[1.5rem]`}>
        <div className={`absolute left-[0.75rem] top-[0.9rem]`}>
          <SearchIcon 
            className={`
              size-[1rem]
              stroke-light-border-icon
              dark:stroke-dark-border-icon
            `}
          />
        </div>
        <input 
          type='text'
          placeholder='검색어를 입력하세요.'
          className={`
            w-[100%] px-[3rem] py-[0.75rem]
            bg-light-gray
            dark:bg-dark-gray
            text-sm focus:outline-0 rounded-md 
          `}
        />
        <div className={`absolute right-[0.75rem] top-[0.75rem]`}>
          <CloseIcon 
            className={`
              size-[1.25rem]
              fill-light-border-icon
              dark:fill-dark-border-icon
            `}
          />
        </div>
      </div>
    </div>
  )
}

export default NavbarLeftExtendSearch;