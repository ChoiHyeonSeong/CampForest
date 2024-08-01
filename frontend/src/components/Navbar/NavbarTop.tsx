import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';

import ProfileModal from './ProfileModal';

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

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const toggleProfileModal = () => {
    setIsProfileModalOpen(!isProfileModalOpen);
  };

  useEffect(() => {
    setLocPath(currentLoc.pathname)
  }, [currentLoc]);

  return (
    <div 
      className={`
        flex justify-between fixed z-[50] lg:z-[30] w-[100%] h-[3.2rem] py-[0.25rem] px-[1rem] 
        bg-light-white border-light-border-1 lg:bg-inherit
        dark:bg-dark-white dark:border-dark-border-1 dark:lg:bg-inherit
        border-b lg:border-none
      `}  
    >
      <div>
        <div
          onClick={props.toggleMenu}
          className={`hidden md:flex lg:hidden flex-all-center w-[2.75rem] h-[100%] me-[1rem] cursor-pointer`}
        >
          <HamMenuIcon 
            className={`
              size-[2rem]
              stroke-light-black
              dark:stroke-dark-black
            `}
          />
        </div>

        <div className={`flex md:hidden items-center w-[10rem] h-[100%] me-[1rem]`}>
          { locPath === '/' ?
            <BigLogoIcon className={`w-[10rem] fill-light-black dark:fill-dark-black`}/> :
            <div className={`text-xl`}>{locPath}</div>
          }
        </div>
      </div>

      <div className={`max-md:hidden lg:hidden`}>
        <Link to='/' onClick={props.closeMenu}>
          <BigLogoIcon className={`w-[10rem] fill-light-black dark:fill-dark-black`}/>
        </Link>
      </div>

      <div className={`flex items-center justify-end w-[6rem] lg:ms-auto`}>
        <PushIcon 
          className={`
            block lg:hidden size-[1.75rem] 
            stroke-light-black
            dark:stroke-dark-black
            cursor-pointer
          `}
        />
        <div className={`relative`}>
          <div 
            onClick={toggleProfileModal}
            className={`
              hidden md:block size-[1.75rem] ms-[0] md:ms-[0.75rem]
              border-light-black bg-light-black
              dark:border-dark-black dark:bg-dark-black
              overflow-hidden border rounded-full cursor-pointer
            `}
          >
            <img src={ProfileImage} alt="NOIMG" />
          </div>
          <ProfileModal isOpen={isProfileModalOpen} onClose={toggleProfileModal}/>
        </div>
      </div>
    </div>
  )
}

export default NavbarTop