import React, { useState } from 'react'
import { RootState } from '@store/store';
import { Link } from 'react-router-dom';

import NavbarLeftExtendMobile from './NavbarLeftExtendMobile';

import DarkmodeBtn from './DarkmodeBtn';

import tempImage from '@assets/logo192.png';

import shortLogoImg from '@assets/logo/mini-logo.png'
import { ReactComponent as BigLogoIcon } from '@assets/logo/logo.svg'

import { ReactComponent as RentalIcon } from '@assets/icons/nav-rental.svg'
import { ReactComponent as CommunityIcon } from '@assets/icons/nav-community.svg'
import { ReactComponent as CampingIcon } from '@assets/icons/nav-findcamping.svg'
import { ReactComponent as PushIcon } from '@assets/icons/nav-push.svg'
import { ReactComponent as ChatIcon } from '@assets/icons/nav-chat.svg'
import { ReactComponent as SearchIcon } from '@assets/icons/nav-search.svg'
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg'

type Props = {
  isMenuOpen: boolean;
  isExtendRentalOpen: boolean;
  isExtendCommunityOpen: boolean;
  isExtendChatOpen: boolean;
  isExtendNotificationOpen: boolean;
  isExtendSearchOpen: boolean;
  isMenuBlocked: boolean;
  toggleExtendMenu: (param:string) => void;
  toggleMenu: () => void;
  closeMenu: () => void;
  handleTransitionEnd: () => void;
  auth: RootState['authStore'];
}

const NavbarLeft = (props: Props) => {
  const isEitherOpen: boolean = (props.isExtendRentalOpen ||
                                 props.isExtendCommunityOpen || 
                                 props.isExtendChatOpen ||
                                 props.isExtendNotificationOpen ||
                                 props.isExtendSearchOpen);
  const [selectedExtendMenu, setSelectedExtendMenu] = useState<string | null>(null);

  return (
    <div 
      className={`fixed z-40 h-full md:mt-11 lg:mt-0 mb-11 md:mb-0 
        transition-all duration-300 ease-in-out
        border-r w-[90vw] bg-white
        ${props.isMenuOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'}
        ${isEitherOpen ? 'md:w-[5rem]' : 'md:w-[15rem]'}
        ${props.isMenuBlocked ? 'block' : 'hidden'}
        `
      } 
      onTransitionEnd={props.handleTransitionEnd}
    >
      {/* desktop tablet */}
      <div className='h-full hidden md:flex flex-col justify-between'>
        {/* main menu */}
        <div>
          <div className='h-[7rem] flex flex-all-center'>
            <Link to='/' onClick={props.closeMenu}>
              <div className={`${isEitherOpen ? 'block' : 'hidden'} w-[5rem] flex flex-all-center`}>
                <img src={shortLogoImg} alt="NoImg" className={`${isEitherOpen ? 'h-8' : 'h-0'} h-8`}/>
              </div>
              <div className={`${isEitherOpen ? 'hidden' : 'block'} flex truncate`}>
                <BigLogoIcon className='fill-[#000000] w-[180]'/>
              </div>
            </Link>
          </div>

          <div className={`h-[7rem] flex ${isEitherOpen ? '-translate-x-full' : 'translate-x-0'} transition-all duration-300 ease-in-out`}>
            <div className={`w-[5rem] ${props.auth.isLoggedIn ? 'flex' : 'hidden'} flex-all-center`}>
              <img src={tempImage} alt="NoImg" className='h-8'/>
            </div>
            {props.auth.isLoggedIn ? (
              <div className={`${isEitherOpen ? 'w-[0rem]' : 'w-[10rem]'} transition-all duration-100 flex items-center truncate`}>{props.auth.user}</div>
            ) : (
              <div className={`${isEitherOpen ? 'w-[0rem]' : 'w-[15rem]'} transition-all duration-100 flex items-center justify-center truncate`}>
                <Link to='/user/login'>로그인 해주세요</Link>
              </div>
            )}
          </div>

          <div className='h-[3.5rem] flex cursor-pointer' onClick={() => props.toggleExtendMenu('rental')}>
            <div className='w-[5rem] flex flex-all-center'>
              <RentalIcon className='stroke-[#999999] w-[2rem]'/>
            </div>
            <div className={`${isEitherOpen ? 'w-[0rem]' : 'w-[10rem]'} transition-all duration-300 flex items-center truncate`}>대여 / 판매</div>
          </div>
          <div className='h-[3.5rem] flex cursor-pointer' onClick={() => props.toggleExtendMenu('community')}>
            <div className='w-[5rem] flex flex-all-center'>
              <CommunityIcon className='stroke-[#999999] w-[2rem]'/>
            </div>
            <div className={`${isEitherOpen ? 'w-[0rem]' : 'w-[10rem]'} transition-all duration-300 flex items-center truncate`}>커뮤니티</div>
          </div>
          <Link to='/camping' className='h-[3.5rem] flex cursor-pointer' onClick={props.closeMenu} >
            <div className='w-[5rem] flex flex-all-center'>
              <CampingIcon className='fill-[#999999] w-[2rem]'/>
            </div>
            <div className={`${isEitherOpen ? 'w-[0rem]' : 'w-[10rem]'} transition-all duration-300 flex items-center truncate`}>캠핑장 찾기</div>
          </Link>
          <div className='h-[3.5rem] flex cursor-pointer' onClick={() => props.toggleExtendMenu('chat')}>
            <div className='w-[5rem] flex flex-all-center'>
              <ChatIcon className='fill-[#999999] w-[2rem]'/>
            </div>
            <div className={`${isEitherOpen ? 'w-[0rem]' : 'w-[10rem]'} transition-all duration-300 flex items-center truncate`}>채팅</div>
          </div>
          <div className='h-[3.5rem] hidden lg:flex cursor-pointer' onClick={() => props.toggleExtendMenu('notification')}>
            <div className='w-[5rem] flex flex-all-center'>
              <PushIcon className='stroke-[#999999] w-[2rem]'/>
            </div>
            <div className={`${isEitherOpen ? 'w-[0rem]' : 'w-[10rem]'} transition-all duration-300 flex items-center truncate`}>알림</div>
          </div>
          <div className='h-[3.5rem] flex cursor-pointer' onClick={() => props.toggleExtendMenu('search')}>
            <div className='w-[5rem] flex flex-all-center'>
              <SearchIcon className='stroke-[#999999] w-[2rem]'/>
            </div>
            <div className={`${isEitherOpen ? 'w-[0rem]' : 'w-[10rem]'} transition-all duration-300 flex items-center truncate`}>검색</div>
          </div>
        </div>
        {/* darkmode */}
        <div className='mb-16 lg:mb-5'>
          <div className={`flex flex-all-center ${isEitherOpen ? 'hidden' : 'block'}`}>
            <p className={`me-5 ${isEitherOpen ? 'w-[0rem]' : 'w-[4rem]'} transition-all duration-300 truncate`}>다크모드</p>
            <DarkmodeBtn />
          </div>
        </div>      
      </div>

      {/* mobile */}
      <div className='flex md:hidden flex-col bg-white'>
        {/* main menu */}
        <div className='flex justify-between items-center h-11'>
          <Link to='/'>
            <BigLogoIcon className='w-[40vw] ps-5 mt-1' fill='black'/>
          </Link>
          <DarkmodeBtn />
          <div className='cursor-pointer me-3' onClick={props.closeMenu}>
            <CloseIcon className={`size-[2rem] ${props.isMenuOpen ? 'block' : 'hidden'}`} fill='black'/>
          </div>
        </div>
        <div className='h-[6rem] flex justify-around items-center'>
          <div className='w-[46vw] flex flex-col items-center text-start'>
            <div className={`w-[5rem] ${props.auth.isLoggedIn ? 'flex' : 'hidden'} flex-all-center`}>
              <img src={tempImage} alt="NoImg" className='h-8'/>
            </div>
            {props.auth.isLoggedIn ? (
              <div className={`${isEitherOpen ? 'w-[0rem]' : 'w-[10rem]'} transition-all duration-100 flex items-center truncate`}>{props.auth.user}</div>
            ) : (
              <div className={`${isEitherOpen ? 'w-[0rem]' : 'w-[15rem]'} transition-all duration-100 flex items-center justify-center truncate`}>
                <Link to='/user/login' onClick={props.closeMenu}>로그인 해주세요</Link>
              </div>
            )}
          </div>
          <div className='w-[22vw] flex flex-all-center'>
            <ChatIcon className={`size-[2rem] ${props.isMenuOpen ? 'block' : 'hidden'}`} fill='black'/>
          </div>
        </div>

        <div className='flex justify-between'>
          <div className='bg-[#EEEEEE] w-3/6'>
            <div className='h-10 mt-6 mb-10 flex flex-all-center text-xl cursor-pointer' onClick={() => setSelectedExtendMenu('rental')}>대여 / 판매</div>
            <div className='h-10 mb-10 flex flex-all-center text-xl cursor-pointer' onClick={() => setSelectedExtendMenu('community')}>커뮤니티</div>
            <div className='h-10 mb-10 flex flex-all-center text-xl cursor-pointer'>캠핑장 찾기</div>
          </div>
          <div className='bg-white w-3/6 h-[calc(100vh-7.75rem)] overflow-y-auto scrollbar-hide'>
            <NavbarLeftExtendMobile selectedExtendMenu={selectedExtendMenu}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavbarLeft