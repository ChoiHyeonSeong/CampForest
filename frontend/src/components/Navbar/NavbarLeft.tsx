import React, { useState, useEffect } from 'react'
import { RootState } from '@store/store';

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
  toggleExtendMenu: (param:string) => void;
  toggleMenu: () => void;
  auth: RootState['authStore'];
}

const NavbarLeft = (props: Props) => {
  const isEitherOpen: boolean = (props.isExtendRentalOpen || props.isExtendCommunityOpen);

  const [selectedExtendMenu, setSelectedExtendMenu] = useState<string | null>(null);

  useEffect(() => {
    if (props.isMenuOpen) {
      // 모달이 열릴 때 스크롤 방지
      document.body.style.overflow = 'hidden';
    } else {
      // 모달이 닫힐 때 스크롤 허용
      document.body.style.overflow = 'unset';
    }

    // 컴포넌트가 언마운트될 때 스크롤 허용
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [props.isMenuOpen]);

  return (
    <div 
      className={`fixed z-10 h-full md:mt-11 lg:mt-0 mb-11 md:mb-0 
        lg:translate-x-0 transition-all duration-300 ease-in-out
        lg:outline lg:outline-1 lg:outline-[#CCCCCC] w-[90vw] bg-white
        ${props.isMenuOpen ? '-translate-x-0 outline outline-1 outline-[#CCCCCC]' : '-translate-x-[100%] outline-none'}
        ${isEitherOpen ? 'md:w-[5rem]' : 'md:w-[15rem]'}`
      }
    >
      {/* desktop tablet */}
      <div className='h-full hidden md:flex flex-col justify-between'>
        {/* main menu */}
        <div>
          <div className='h-[7rem] flex flex-all-center'>
            <div className={`${isEitherOpen ? 'block' : 'hidden'} w-[5rem] flex flex-all-center`}>
              <img src={shortLogoImg} alt="NoImg" className={`${isEitherOpen ? 'h-8' : 'h-0'} h-8`}/>
            </div>
            <div className={`${isEitherOpen ? 'hidden' : 'block'} flex truncate`}>
              <BigLogoIcon className='fill-[#000000] w-[180]'/>
            </div>
          </div>

          <div className={`h-[7rem] flex ${isEitherOpen ? '-translate-x-full' : 'translate-x-0'} transition-all duration-300 ease-in-out`}>
            <div className={`w-[5rem] ${props.auth.isLoggedIn ? 'flex' : 'hidden'} flex-all-center`}>
              <img src={tempImage} alt="NoImg" className='h-8'/>
            </div>
            {props.auth.isLoggedIn ? (
              <div className={`${isEitherOpen ? 'w-[0rem]' : 'w-[10rem]'} transition-all duration-100 flex items-center truncate`}>{props.auth.user}</div>
            ) : (
              <div className={`${isEitherOpen ? 'w-[0rem]' : 'w-[15rem]'} transition-all duration-100 flex items-center justify-center truncate`}>로그인 해주세요</div>
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
          <div className='h-[3.5rem] flex'>
            <div className='w-[5rem] flex flex-all-center'>
              <CampingIcon className='fill-[#999999] w-[2rem]'/>
            </div>
            <div className={`${isEitherOpen ? 'w-[0rem]' : 'w-[10rem]'} transition-all duration-300 flex items-center truncate`}>캠핑장 찾기</div>
          </div>
          <div className='h-[3.5rem] flex'>
            <div className='w-[5rem] flex flex-all-center'>
              <ChatIcon className='fill-[#999999] w-[2rem]'/>
            </div>
            <div className={`${isEitherOpen ? 'w-[0rem]' : 'w-[10rem]'} transition-all duration-300 flex items-center truncate`}>채팅</div>
          </div>
          <div className='h-[3.5rem] hidden lg:flex'>
            <div className='w-[5rem] flex flex-all-center'>
              <PushIcon className='stroke-[#999999] w-[2rem]'/>
            </div>
            <div className={`${isEitherOpen ? 'w-[0rem]' : 'w-[10rem]'} transition-all duration-300 flex items-center truncate`}>알림</div>
          </div>
          <div className='h-[3.5rem] flex'>
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
          <BigLogoIcon className='w-[40vw] ps-5 mt-1' fill='black'/>
          <DarkmodeBtn />
          <div className='cursor-pointer me-3' onClick={props.toggleMenu}>
            <CloseIcon width={32} fill='black'/>
          </div>
        </div>
        <div className='h-[5rem] flex justify-around items-center'>
          <div className='w-[22vw] flex flex-all-center'>
            <img src={tempImage} alt="NoImg" className='h-[3rem]'/>
          </div>
          <div className='w-[46vw] flex flex-col items-center text-start'>
            <p className='w-[46vw]'>여기는 닉네임입니다.</p>
            <p className='w-[46vw]'>그럼 여기는 작성글</p>
          </div>
          <div className='w-[22vw] flex flex-all-center'>
            <ChatIcon className='h-[2rem]' fill='black'/>
          </div>
        </div>

        <div className='flex justify-between'>
          <div className='bg-[#CCCCCC] w-3/6'>
            <div className='h-10 mt-6 mb-10 flex flex-all-center text-xl cursor-pointer' onClick={() => setSelectedExtendMenu('rental')}>대여 / 판매</div>
            <div className='h-10 mb-10 flex flex-all-center text-xl cursor-pointer' onClick={() => setSelectedExtendMenu('community')}>커뮤니티</div>
            <div className='h-10 mb-10 flex flex-all-center text-xl cursor-pointer' onClick={() => setSelectedExtendMenu(null)}>캠핑장 찾기</div>
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