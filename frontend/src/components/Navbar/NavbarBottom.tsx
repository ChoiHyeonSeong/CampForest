import React from 'react'

import { ReactComponent as HamMenuIcon } from '@assets/icons/ham-menu.svg'
import { ReactComponent as SearchIcon } from '@assets/icons/nav-search.svg'
import { ReactComponent as HomeIcon } from '@assets/icons/home.svg'
import { ReactComponent as ChatIcon } from '@assets/icons/nav-chat.svg'
import { ReactComponent as MyPageIcon } from '@assets/icons/mypage.svg'

type Props = {
  toggleMenu: () => void;
}

const NavbarBottom = (props: Props) => {
  return (
    <div className='fixed bottom-0 w-full h-11 flex md:hidden justify-around bg-white outline outline-1 outline-[#CCCCCC]'>
      <div className='w-11 flex flex-all-center cursor-pointer' onClick={props.toggleMenu}>
        <HamMenuIcon width={32} stroke={'black'}/>
      </div>
      <div className='w-11 flex flex-all-center'>
        <SearchIcon width={32} stroke={'black'}/>
      </div>
      <div className='w-11 flex flex-all-center'>
        <HomeIcon width={32} fill={'black'}/>
      </div>
      <div className='w-11 flex flex-all-center'>
        <ChatIcon width={32} fill={'black'}/>
      </div>
      <div className='w-11 flex flex-all-center'>
        <MyPageIcon width={32}/>
      </div>
    </div>
  )
}

export default NavbarBottom