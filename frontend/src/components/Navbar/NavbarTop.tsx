import React from 'react'

import { ReactComponent as BigLogoIcon } from '@assets/logo/logo.svg'
import { ReactComponent as HamMenuIcon } from '@assets/icons/ham-menu.svg'
import { ReactComponent as PushIcon } from '@assets/icons/nav-push.svg'

type Props = {
  toggleMenu: () => void;
}

const NavbarTop = (props: Props) => {
  return (
    <div className='fixed md:z-30 w-full h-11 flex lg:hidden justify-between bg-white outline outline-1 outline-[#CCCCCC]'>
      <div className='cursor-pointer hidden md:flex flex-all-center ms-11 w-11' onClick={props.toggleMenu}>
        <HamMenuIcon width={36} stroke={'black'}/>
      </div>
      {/* 모바일용 공간 */}
      <div className='block md:hidden ms-5 w-11'/>

      <div className=''>
        <BigLogoIcon className='pt-1 fill-[#000000] w-[12rem]'/>
      </div>

      <div className='cursor-pointer flex flex-all-center me-5 md:me-11 w-11'>
        <PushIcon width={36} stroke={'black'}/>
      </div>
    </div>
  )
}

export default NavbarTop