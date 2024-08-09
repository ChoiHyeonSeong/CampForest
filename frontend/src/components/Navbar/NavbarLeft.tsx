import React, { useState } from 'react'
import { RootState, store } from '@store/store';
import { Link } from 'react-router-dom';

import NavbarLeftExtendMobile from './NavbarLeftExtendMobile';

import DarkmodeBtn from './DarkmodeBtn';

import tempImage from '@assets/images/basic_profile.png';

import { ReactComponent as BigLogoIcon } from '@assets/logo/logo.svg'

import { ReactComponent as RentalIcon } from '@assets/icons/nav-rental.svg'
import { ReactComponent as CommunityIcon } from '@assets/icons/nav-community.svg'
import { ReactComponent as CampingIcon } from '@assets/icons/nav-findcamping.svg'
import { ReactComponent as PushIcon } from '@assets/icons/nav-push.svg'
import { ReactComponent as ChatIcon } from '@assets/icons/nav-chat.svg'
import { ReactComponent as SearchIcon } from '@assets/icons/nav-search.svg'
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg'
import { useSelector } from 'react-redux';

import ShortLogo from '@assets/logo/mini-logo.png'
import { ReactComponent as LongLogo } from '@assets/logo/logo.svg'

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
  user: RootState['userStore'];
}

const NavbarLeft = (props: Props) => {
  const isEitherOpen: boolean = (props.isExtendRentalOpen ||
                                 props.isExtendCommunityOpen || 
                                 props.isExtendChatOpen ||
                                 props.isExtendNotificationOpen ||
                                 props.isExtendSearchOpen);
  const [selectedExtendMenu, setSelectedExtendMenu] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const totalUnreadCount = useSelector((state: RootState) => state.chatStore.totalUnreadCount);

  return (
    <div 
      className={`
        ${isHovered && !isEitherOpen ? 'lg:w-[15rem]' : 'lg:w-[5rem]'}
        ${props.isMenuOpen ? 'translate-x-[0]' : '-translate-x-[100%] lg:translate-x-[0]'}
        ${isEitherOpen ? 'md:w-[5rem]' : 'md:w-[15rem]'}
        ${props.isMenuBlocked ? 'block' : 'hidden lg:block'}
        fixed z-[60] md:z-[40] w-[90vw] h-[100%] mb-[2.75rem] pt-[0] md:pt-[3.2rem]
        bg-light-white border-light-border-1
        dark:bg-dark-white dark:border-dark-border-1
        border-r transition-all duration-300 ease-in-out
      `} 
      onTransitionEnd={props.handleTransitionEnd}
    >
      {/* desktop tablet */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)} 
        className={`
          hidden md:flex flex-col justify-between h-[100%]
        `}
      >
        {/* main menu */}

        {/* 로고 */}
        <div className={`hidden lg:flex justify-center h-[3rem]`}>
          <Link to='/' onClick={props.closeMenu}>
            {/* 짧로고 */}
            <div 
              className={`
                ${isHovered && !isEitherOpen ? 'lg:w-[0rem]' : 'lg:w-[5rem]'} 
                ${isEitherOpen ? 'w-[5rem]' : 'w-[0rem]'}
                flex justify-center
              `}
            >
              <img 
                src={ShortLogo} 
                alt="NOIMG"
                className={`h-[100%]`}/>
            </div>

            {/* 긴로고 */}
            <div 
              className={`
                ${isHovered && !isEitherOpen ? 'lg:w-[10rem]' : 'lg:w-[0rem]'} 
                ${isEitherOpen ? 'w-[0rem]' : 'w-[10rem]'}
              `}
            >
              <LongLogo 
                className={`
                  h-[100%] 
                  fill-light-black
                  dark:fill-dark-black
                `}
              />
            </div>
          </Link>
        </div>
        
        {/* 메뉴들 */}
        <div className={`flex flex-col flex-grow justify-center gap-8`}>

          {/* 대여판매 */}
          <div 
            onClick={() => props.toggleExtendMenu('rental')}
            className={`flex h-[3.5rem] cursor-pointer`} 
          >
            <div className={`flex flex-all-center w-[5rem]`}> 
              <RentalIcon 
                className={`
                  w-[2rem]
                  stroke-light-border-icon
                  dark:stroke-dark-border-icon
                `}
              />
            </div>
            <div 
              className={`
                ${isHovered && !isEitherOpen ? 'lg:w-[10rem]' : 'lg:w-[0rem]'}
                ${isEitherOpen ? 'w-[0rem]' : 'w-[10rem]'}
                flex items-center
                transition-all duration-300 truncate
              `}
            >
              대여 / 판매
            </div>
          </div>

          {/* 커뮤니티 */}
          <div 
            onClick={() => props.toggleExtendMenu('community')}
            className={`flex h-[3.5rem] cursor-pointer`} 
          >
            <div className={`flex flex-all-center w-[5rem]`}>
              <CommunityIcon 
                className={`
                  w-[2rem]
                  stroke-light-border-icon
                  dark:stroke-dark-border-icon
                `}
              />
            </div>
            <div 
              className={`
                ${isHovered && !isEitherOpen ? 'lg:w-[10rem]' : 'lg:w-[0rem]'}
                ${isEitherOpen ? 'w-[0rem]' : 'w-[10rem]'}
                flex items-center
                transition-all duration-300 truncate
              `}
            >
              커뮤니티
            </div>
          </div>

          {/* 캠핑장 찾기 */}
          <Link to='/camping' onClick={props.closeMenu} >
            <div className={`flex h-[3.5rem] cursor-pointer`}>
              <div className={`flex flex-all-center w-[5rem]`}>
                <CampingIcon 
                  className={`
                    w-[2rem]
                    fill-light-border-icon
                    dark:fill-dark-border-icon
                  `} 
                />
              </div>
              <div 
                className={`
                  ${isHovered && !isEitherOpen ? 'lg:w-[10rem]' : 'lg:w-[0rem]'}
                  ${isEitherOpen ? 'w-[0rem]' : 'w-[10rem]'}
                  flex items-center
                  transition-all duration-300 truncate
                `}
              >
                캠핑장 찾기
              </div>
            </div>
          </Link>

          {/* 채팅 */}
          <div 
            onClick={() => props.toggleExtendMenu('chat')}
            className={`flex h-[3.5rem] cursor-pointer`} 
          >
            <div className={`flex flex-all-center relative w-[5rem]`}>
              <ChatIcon 
                className={`
                  w-[2rem]
                  fill-light-border-icon
                  dark:fill-dark-border-icon
                `} 
                />
                {totalUnreadCount > 0 && 
                  <div 
                    className='flex items-center justify-center absolute right-[0.75rem] top-0 min-w-[1rem] 
                    bg-light-warning text-light-white
                    dark:bg-dark-warning dark:text-dark-white
                    text-sm rounded-full'
                  >
                    {totalUnreadCount}
                </div>
                }
            </div>
            <div
              className={`
                ${isHovered && !isEitherOpen ? 'lg:w-[10rem]' : 'lg:w-[0rem]'}
                ${isEitherOpen ? 'w-[0rem]' : 'w-[10rem]'}
                flex items-center
                transition-all duration-300 truncate
              `}
            >
              채팅
            </div>
          </div>

          {/* 알림 */}
          <div 
            onClick={() => props.toggleExtendMenu('notification')}
            className={`hidden lg:flex h-[3.5rem] cursor-pointer`}
          >
            <div className={`flex flex-all-center w-[5rem]`}>
              <PushIcon 
                className={`
                  w-[2rem]
                  stroke-light-border-icon
                  dark:stroke-dark-border-icon
                `} 
              />
            </div>
            <div 
              className={`
                ${isHovered && !isEitherOpen ? 'lg:w-[10rem]' : 'lg:w-[0rem]'}
                ${isEitherOpen ? 'w-[0rem]' : 'w-[10rem]'}
                flex items-center
                transition-all duration-300 truncate
              `}
            >
              알림
            </div>
          </div>

          {/* 검색 */}
          <div 
            onClick={() => props.toggleExtendMenu('search')}
            className={`flex h-[3.5rem] cursor-pointer`}
          >
            <div className={`flex flex-all-center w-[5rem]`}>
              <SearchIcon 
                className={`
                  w-[2rem]
                  stroke-light-border-icon
                  dark:stroke-dark-border-icon
                `}
              />
            </div>
            <div 
              className={`
                ${isHovered && !isEitherOpen ? 'lg:w-[10rem]' : 'lg:w-[0rem]'}
                ${isEitherOpen ? 'w-[0rem]' : 'w-[10rem]'}
                flex items-center
                transition-all duration-300 truncate
              `}
            >
              검색
            </div>
          </div>

        </div>

        {/* darkmode */}
        <div className={`h-[2rem] mb-[4rem] lg:mb-[1.25rem]`}>
          <div 
            className={`
              ${isHovered && !isEitherOpen ? 'lg:translate-x-0' : 'lg:-translate-x-[150%]'} 
              ${isEitherOpen ? '-translate-x-[150%]' : 'translate-x-0'} 
              flex flex-all-center
              transition-all duration-300 ease-in-out
            `}
          >
            <p className={`me-[1.25rem]`}>다크모드</p>
            <DarkmodeBtn />
          </div>
        </div>      
      </div>

      {/* mobile */}
      <div 
        className={`
          flex flex-col md:hidden  
          bg-light-white
          dark:bg-dark-white
        `}
      >
        {/* 상단 */}
        <div className={`flex justify-between items-center h-[2.75rem]`}>
          {/* 홈가는 로고 */}
          <Link to='/' onClick={props.closeMenu}>
            <BigLogoIcon 
              className={`
                w-[40vw] mt-[0.25rem] ps-[1.25rem]
                fill-light-black
                dark:fill-dark-black
              `}
            />
          </Link>
          
          {/* 다크모드 버튼 */}
          <DarkmodeBtn />

          {/* 닫기 버튼 */}
          <div className={`me-[0.75rem] cursor-pointer`} onClick={props.closeMenu}>
            <CloseIcon 
              className={`
                ${props.isMenuOpen ? 'block' : 'hidden'}
                size-[2rem]
                fill-light-black
                dark:fill-dark-black
              `}
            />
          </div>
        </div>

        {/* 중단 */}
        <div className={`flex justify-around items-center h-[6rem]`}>

          {/* 프로필 및 로그인 로그아웃 */}
          <div className={`flex flex-col items-center w-[46vw] text-start`}>
            <div 
              className={`
                ${props.user.isLoggedIn ? 'flex' : 'hidden'}
                flex-all-center w-[5rem]
              `}
            >
              <img 
                src={tempImage} 
                alt={tempImage} 
                className={`h-[2rem]`}
              />
            </div>
            {props.user.isLoggedIn ? (
              <div 
                className={`
                  ${isEitherOpen ? 'w-[0rem]' : 'w-[10rem]'}
                  transition-all duration-100 flex items-center truncate
                `}
              >
                {props.user.nickname}
              </div>
            ) : (
              <div 
                className={`
                  ${isEitherOpen ? 'w-[0rem]' : 'w-[15rem]'} 
                  flex items-center justify-center
                  transition-all duration-100  truncate
                `}
              >
                <Link to='/user/login' onClick={props.closeMenu}>
                  로그인 해주세요
                </Link>
              </div>
            )}
          </div>

          {/* 채팅 아이콘 */}
          <div className={`flex flex-all-center w-[22vw]`}>
            <ChatIcon 
              className={`
                ${props.isMenuOpen ? 'block' : 'hidden'}
                size-[2rem]
                fill-light-black
                dark:fill-dark-black
              `}
            />
          </div>
        </div>

        {/* 하단 */}
        <div className={`flex justify-between`}>
          <div 
            className={`
              w-[50%]
              bg-light-white
              dark:bg-dark-white
            `}
          >
            {/* 대여 판매 탭 */}
            <div 
              onClick={() => setSelectedExtendMenu('rental')}
              className={`flex flex-all-center h-[2.5rem] mt-[1.5rem] mb-[2.5rem] text-xl cursor-pointer`} 
            >
              대여 / 판매
            </div>

            {/* 커뮤니티 탭 */}
            <div 
              onClick={() => setSelectedExtendMenu('community')}
              className={`flex flex-all-center h-[2.5rem] mb-[2.5rem] text-xl cursor-pointer`}
            >
              커뮤니티
            </div>

            {/* 캠핑장 찾기 탭 */}
            <Link to='/camping' onClick={props.closeMenu}>
              <div 
                className={`flex flex-all-center h-[2.5rem] mb-[2.5rem] text-xl cursor-pointer`}
              >
                캠핑장 찾기
              </div>
            </Link>
          </div>

          {/* navbar 확장 */}
          <div 
            className={`
              w-[50%] h-[calc(100vh-7.75rem)]
              bg-light-white
              dark:bg-dark-white
              overflow-y-auto scrollbar-hide
            `}
          >
            <NavbarLeftExtendMobile selectedExtendMenu={selectedExtendMenu} closeMenu={props.closeMenu}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavbarLeft