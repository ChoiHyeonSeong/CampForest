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
      className={`fixed z-30 w-[25rem] h-full
        transition-all duration-300 ease-in-out 
        ${props.isExtendMenuOpen ? 'translate-x-[5rem]' : '-translate-x-full'} 
        bg-white outline outline-1 outline-[#CCCCCC]`
      }
    >
      <div className='h-20 ps-4 flex items-center'>
        <LeftArrow className='me-3 cursor-pointer w-5 h-5' onClick={() => props.toggleExtendMenu('search')}/>
        <p className='text-2xl'>검색</p>
      </div>
      <div className='relative w-[calc(100%-3rem)] mx-[1.5rem]'>
        <div className='absolute left-[0.75rem] top-[0.9rem]'>
          <SearchIcon stroke='#777777' className='size-[1rem]'/>
        </div>
        <input 
          type='text'
          placeholder='검색어를 입력하세요.'
          className='text-sm focus:outline-0 rounded-md bg-[#EEEEEE] px-[3rem] py-[0.75rem] w-full'/>
        <div className='absolute right-[0.75rem] top-[0.75rem]'>
          <CloseIcon fill='#777777' className='size-[1.25rem] '/>
        </div>
      </div>
    </div>
  )
}

export default NavbarLeftExtendSearch;