import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';
import ProfileModal from './ProfileModal';

import { ReactComponent as BigLogoIcon } from '@assets/logo/logo.svg'
import { ReactComponent as HamMenuIcon } from '@assets/icons/ham-menu.svg'
import { ReactComponent as PushIcon } from '@assets/icons/nav-push.svg'

import ProfileImage from '@assets/images/basic_profile.png'
import NavTopPushModal from './NavTopPushModal';

type Props = {
  toggleMenu: () => void;
  closeMenu: () => void;
}

const NavbarTop = (props: Props) => {
  const user = useSelector((state: RootState) => state.userStore);
  const [locPath, setLocPath] = useState<string | null>(null);
  const currentLoc = useLocation();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPushModalOpen, setIsPushModalOpen] = useState(false);

  const togglePushModal = () => {
    setIsPushModalOpen(!isPushModalOpen);
    if (!isPushModalOpen) {
      setIsProfileModalOpen(false);
    }
  };

  const closePushModal = () => {
    setIsPushModalOpen(false);
  };

  const toggleProfileModal = () => {
    setIsProfileModalOpen(!isProfileModalOpen);
    if (!isProfileModalOpen) {
      setIsPushModalOpen(false);
    }
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  useEffect(() => {
    setLocPath(currentLoc.pathname)
  }, [currentLoc]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = ProfileImage;
  };

  return (
    <div 
      className={`
        flex justify-between fixed lg:top-0 md:right-0 z-[50] lg:z-[30] w-[100%] lg:w-[1.75rem] h-[3.2rem] py-[0.25rem] ps-[0.5rem] md:ps-0 lg:mx-[1rem] 
        bg-light-white
        dark:bg-dark-white dark:bg-opacity-80
        lg:bg-inherit 
        dark:lg:bg-inherit
        lg:border-none
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

      {/* 알림 */}
      <div className={`flex items-center justify-end w-[6rem] lg:w-[1.75rem] lg:ms-auto me-[0.75rem] lg:me-0`}>
        <div className='relative'>
          <PushIcon
            onClick={togglePushModal}
            className={`
              block lg:hidden size-[1.45rem] 
              stroke-light-black
              dark:stroke-dark-black
              cursor-pointer
            `}
          />
          <NavTopPushModal
            isOpen={isPushModalOpen}
            onClose={closePushModal}
          />
        </div>
        
        {/* 마이프로필 */}
        <div className={`relative`}>
          <div 
            onClick={toggleProfileModal}
            className={`
              hidden md:block size-[1.85rem] ms-[0] md:ms-[0.75rem] lg:ms-0
              overflow-hidden rounded-full cursor-pointer hover:scale-105 transition-transform duration-300
            `}
          >
            <img 
              src={user.profileImage ? user.profileImage : ProfileImage} 
              alt="NOIMG" 
              onError={handleImageError}  
            />
          </div>
          <ProfileModal
            isOpen={isProfileModalOpen}
            onClose={closeProfileModal}
          />
        </div>
      </div>
    </div>
  )
}

export default NavbarTop