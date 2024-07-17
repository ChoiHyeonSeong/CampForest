import React from 'react'
import tempImage from '@assets/logo192.png';

import shortLogoImg from '@assets/logo/mini-logo.png'
import { ReactComponent as BigLogoIcon } from '@assets/logo/logo.svg'

import { ReactComponent as RentalIcon } from '@assets/icons/nav-rental.svg'
import { ReactComponent as CommunityIcon } from '@assets/icons/nav-community.svg'
import { ReactComponent as CampingIcon } from '@assets/icons/nav-findcamping.svg'
import { ReactComponent as PushIcon } from '@assets/icons/nav-push.svg'
import { ReactComponent as ChatIcon } from '@assets/icons/nav-chat.svg'
import { ReactComponent as SearchIcon } from '@assets/icons/nav-search.svg'

type Props = {
  isMenuOpen: boolean;
  isExtendRentalOpen: boolean;
  isExtendCommunityOpen: boolean;
  toggleExtendMenu: (param:string) => void;
  toggleMenu: () => void;
}

const NavbarLeft = (props: Props) => {
  const isEitherOpen = (props.isExtendRentalOpen || props.isExtendCommunityOpen);

  return (
    <div 
      className={`fixed z-10 h-full md:mt-10 lg:mt-0 mb-10 md:mb-0 
        lg:translate-x-0 transition-all duration-300 ease-in-out
        ${props.isMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        ${isEitherOpen ? 'w-[5rem]' : 'w-[15rem]'} 
        bg-white outline outline-1 outline-[#CCCCCC]`
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
            <div className='w-[5rem] flex flex-all-center'>
              <img src={tempImage} alt="NoImg" className='h-8'/>
            </div>
            <div className={`${isEitherOpen ? 'w-[0rem]' : 'w-[10rem]'} transition-all duration-100 flex items-center truncate`}>프로필 들어갑니다</div>
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
          <div className='h-[3.5rem] flex'>
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
        <div className='mb-0 md:mb-10 lg:mb-0'>
          <div className={`bg-blue-500 ${isEitherOpen ? 'hidden' : 'block'}`}>darkmode</div>
        </div>      
      </div>

      {/* mobile */}
      <div className='flex md:hidden flex-col'>
        {/* main menu */}
        <div className='bg-gray-600 flex justify-between h-10'>
          <div>Logo</div>
          <div>darkmode</div>
          <div>
            <button onClick={props.toggleMenu}>quit</button>
          </div>
        </div>
        <div className='bg-gray-100 h-14'>Profile</div>
        <div className='bg-gray-600 flex justify-between  '>
          <div className='bg-blue-100 w-3/6'>
            <div className='h-10 flex flex-all-center'>대여 / 판매</div>
            <div className='h-10 flex flex-all-center'>커뮤니티</div>
            <div className='h-10 flex flex-all-center'>캠핑장 찾기</div>
          </div>
          <div className='bg-blue-500 w-3/6 h-screen overflow-y-auto scrollbar-hide'>
            <div className='h-96'>메뉴</div>
            <div className='h-96'>메뉴</div>
            <div className='h-96'>메뉴</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavbarLeft