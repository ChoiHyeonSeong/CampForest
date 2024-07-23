import React from 'react'
import { Link } from 'react-router-dom';

import { ReactComponent as HamMenuIcon } from '@assets/icons/ham-menu.svg'
import { ReactComponent as SearchIcon } from '@assets/icons/nav-search.svg'
import { ReactComponent as HomeIcon } from '@assets/icons/home.svg'
import { ReactComponent as ChatIcon } from '@assets/icons/nav-chat.svg'
import { ReactComponent as MyPageIcon } from '@assets/icons/mypage.svg'

type Props = {
  toggleMenu: () => void;
  closeMenu: () => void;
}

const NavbarBottom = (props: Props) => {
  return (
    <div className='fixed z-30 bottom-0 w-full h-11 flex md:hidden justify-around bg-white outline outline-1 outline-[#CCCCCC]'>
      <div className='w-11 flex flex-all-center cursor-pointer' onClick={props.toggleMenu}>
        <HamMenuIcon className='size-[2rem]' stroke={'black'}/>
      </div>
      <div className='w-11 flex flex-all-center'>
        <SearchIcon className='size-[1.5rem]' stroke={'black'}/>
      </div>    
      <div className='w-11 flex flex-all-center'>
        <Link to='/' onClick={props.closeMenu}>
          <HomeIcon className='size-[1.5rem]' fill={'black'}/>
        </Link>
      </div>
      <div className='w-11 flex flex-all-center'>
        <ChatIcon className='size-[1.5rem]' fill={'black'}/>
      </div>
      <div className='w-11 flex flex-all-center'>
        <MyPageIcon className='size-[1.5rem]'/>
      </div>
    </div>
  )
}

export default NavbarBottom