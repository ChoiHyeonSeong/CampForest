import React from 'react'
import { Link } from 'react-router-dom';

import { ReactComponent as BigLogoIcon } from '@assets/logo/logo.svg'
import { ReactComponent as HamMenuIcon } from '@assets/icons/ham-menu.svg'
import { ReactComponent as PushIcon } from '@assets/icons/nav-push.svg'

type Props = {
  toggleMenu: () => void;
  closeMenu: () => void;
}

const NavbarTop = (props: Props) => {
  return (
    <div className='fixed py-1 z-30 h-[3.2rem] md:z-50 w-full flex justify-between bg-white border-b border-[#EEEEEE] px-[1rem]'>
      <div className='cursor-pointer flex flex-all-center w-11 me-[1rem]' onClick={props.toggleMenu}>
        <HamMenuIcon className=' size-[2rem]' stroke={'black'}/>
      </div>

      <div className='max-md:hidden'>
        <Link to='/' onClick={props.closeMenu}>
          <BigLogoIcon className='fill-[#000000] w-[10rem]'/>
        </Link>
      </div>

      <div className='lg:ms-auto cursor-pointer flex flex-all-center w-11'>
        <PushIcon className='size-[1.5rem]' stroke={'black'}/>
      </div>
    </div>
  )
}

export default NavbarTop