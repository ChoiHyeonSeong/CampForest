import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';

import { ReactComponent as BigLogoIcon } from '@assets/logo/logo.svg'
import { ReactComponent as HamMenuIcon } from '@assets/icons/ham-menu.svg'
import { ReactComponent as PushIcon } from '@assets/icons/nav-push.svg'

import ProfileImage from '@assets/images/profileimgs.png'

type Props = {
  toggleMenu: () => void;
  closeMenu: () => void;
}

const NavbarTop = (props: Props) => {
  const [locPath, setLocPath] = useState<string | null>(null);
  const currentLoc = useLocation();

  useEffect(() => {
    setLocPath(currentLoc.pathname)
  }, [currentLoc]);

  return (
    <div className='fixed py-1 h-[3.2rem] z-50 w-full flex justify-between px-[1rem] bg-white lg:bg-inherit border-b lg:border-none'>
      <div>
        <div className='cursor-pointer flex-all-center w-11 h-full me-[1rem] hidden md:flex lg:hidden' onClick={props.toggleMenu}>
          <HamMenuIcon className='size-[2rem]' stroke={'black'}/>
        </div>
        <div className='w-[10rem] h-full me-[1rem] bl flex md:hidden items-center'>
          { locPath === '/' ?
            <BigLogoIcon className='fill-[#000000] w-[10rem]' /> :
            <div className='text-xl'>{locPath}</div>
          }
        </div>
      </div>

      <div className='max-md:hidden lg:hidden'>
        <Link to='/' onClick={props.closeMenu}>
          <BigLogoIcon className='fill-[#000000] w-[10rem]'/>
        </Link>
      </div>

      <div className='lg:ms-auto flex items-center justify-end w-[6rem] lg:w-[6rem]'>
        <PushIcon className='cursor-pointer size-[1.75rem] block lg:hidden' stroke={'black'}/>
        <div className='cursor-pointer ms-0 md:ms-3 hidden md:block size-[1.75rem] rounded-full overflow-hidden border border-black'>
          <img src={ProfileImage} alt="" />
        </div>
      </div>
    </div>
  )
}

export default NavbarTop