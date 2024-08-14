import React, { useState, useRef, useEffect } from 'react'
import { RootState, store } from '@store/store';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { logout } from '@services/authService';

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
import { ReactComponent as LeftIcon } from '@assets/icons/arrow-right.svg'
import ShortLogo from '@assets/logo/mini-logo.png'
import { ReactComponent as LongLogo } from '@assets/logo/logo.svg'

// 모바일 카테고리 사진
import cateAll from '@assets/category/cate-all.png'
import cateTent from '@assets/category/cate-tent.png'
import cateChair from '@assets/category/cate-chair.png'
import cateBed from '@assets/category/cate-bed.png'
import cateTable from '@assets/category/cate-table.png'
import cateLantern from '@assets/category/cate-lantern.png'
import cateCook from '@assets/category/cate-cooking.png'
import cateSafety from '@assets/category/cate-safety.png'
import cateBurner from '@assets/category/cate-burner.png'
import cateEtc from '@assets/category/cate-etc.png'

type SubItem = {
  title: string;
  linkTo: string;
  image?: string;
};

type MenuItem = {
  title: string;
  key: string;
  linkTo?: string;
  subItems?: SubItem[];
};

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
  const isEitherOpen: boolean = (
    props.isExtendRentalOpen ||
    props.isExtendCommunityOpen || 
    props.isExtendChatOpen ||
    props.isExtendNotificationOpen ||
    props.isExtendSearchOpen
  );
  const [selectedExtendMenu, setSelectedExtendMenu] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const communityUnreadCount = useSelector((state: RootState) => state.chatStore.communityUnreadCount);
  const transactionUnreadCount = useSelector((state: RootState) => state.chatStore.transactionUnreadCount);
  const notificationState = useSelector((state: RootState) => state.notificationStore)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.userStore);
  const navbarRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    if (isLeftSwipe) {
      props.closeMenu();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
        props.closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [props]);

  const toggleMobileMenu = (menu: string) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  }

  const handleLogout = async () => {
    await logout();
    props.closeMenu();
    window.location.reload();
  };

  const mobileMenuItems: MenuItem[] = [
    {
      title: '대여 / 판매',
      key: 'rental',
      subItems: [
        { title: "전체", linkTo: 'product/list/all', image: cateAll },
        { title: "텐트", linkTo: 'product/list/tent', image: cateTent },
        { title: "의자", linkTo: 'product/list/chair', image: cateChair },
        { title: "침낭/매트", linkTo: 'product/list/sleeping', image: cateBed },
        { title: "테이블", linkTo: 'product/list/table', image: cateTable },
        { title: "랜턴", linkTo: 'product/list/lantern', image: cateLantern },
        { title: "코펠/식기", linkTo: 'product/list/cookware', image: cateCook },
        { title: "안전용품", linkTo: 'product/list/safety', image: cateSafety },
        { title: "버너/화로", linkTo: 'product/list/burner', image: cateBurner },
        { title: "기타", linkTo: 'product/list/etc', image: cateEtc },
      ]
    },
    {
      title: '커뮤니티',
      key: 'community',
      subItems: [
        { title: '전체보기', linkTo: 'community/all' },
        { title: '자유게시판', linkTo: 'community/free' },
        { title: '질문게시판', linkTo: 'community/question' },
        { title: '캠핑장양도', linkTo: 'community/assign' },
        { title: '레시피추천', linkTo: 'community/recipe' },
        { title: '캠핑장비 후기', linkTo: 'community/equipment' },
      ]
    },
    {
      title: '캠핑장 찾기',
      key: 'camping',
      linkTo: '/camping'
    }
  ];

  return (
    <div
      ref={navbarRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`
        ${isHovered && !isEitherOpen ? 'lg:w-[15rem]' : 'lg:w-[5rem]'}
        ${props.isMenuOpen ? 'translate-x-[0]' : '-translate-x-[100%] lg:translate-x-[0]'}
        ${isEitherOpen ? 'md:w-[5rem]' : 'md:w-[15rem]'}
        ${props.isMenuBlocked ? 'block' : 'hidden lg:block'}
        fixed z-[60] md:z-[40] w-[82vw] h-[100%] mb-[2.75rem] pt-[0] md:pt-[3.2rem]
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
                hover:scale-110 transition-transform
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
        <div className={`flex flex-col flex-grow mt-[4rem] gap-[1rem] px-[0.5rem]`}>

          {/* 대여판매 */}
          <div 
            onClick={() => props.toggleExtendMenu('rental')}
            className={`
              flex h-[3.5rem]
              hover:bg-light-gray
              dark:hover:bg-dark-gray
              cursor-pointer rounded-lg transition-colors
            `} 
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
            className={`
              flex h-[3.5rem]
              hover:bg-light-gray
              dark:hover:bg-dark-gray
              cursor-pointer rounded-lg transition-colors
            `} 
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
            <div
              className={`
                flex h-[3.5rem]
                hover:bg-light-gray
                dark:hover:bg-dark-gray
                cursor-pointer rounded-lg transition-colors
              `}
            >
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
            className={`
              flex h-[3.5rem]
              hover:bg-light-gray
              dark:hover:bg-dark-gray
              cursor-pointer rounded-lg transition-colors
            `} 
          >
            <div className={`flex flex-all-center relative w-[5rem]`}>
              <ChatIcon 
                className={`
                  w-[2rem]
                  fill-light-border-icon
                  dark:fill-dark-border-icon
                `} 
                />
                {(transactionUnreadCount + communityUnreadCount) > 0 && 
                  <div 
                    className='flex items-center justify-center absolute right-[0.75rem] top-0 min-w-[1rem] 
                    bg-light-warning text-light-white
                    dark:bg-dark-warning dark:text-dark-white
                    text-sm rounded-full'
                  >
                    {transactionUnreadCount + communityUnreadCount}
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
            className={`
              hidden lg:flex h-[3.5rem]
              hover:bg-light-gray
              dark:hover:bg-dark-gray
              cursor-pointer rounded-lg transition-colors
            `} 
          >
            <div className={`flex flex-all-center relative w-[5rem]`}>
              <PushIcon 
                className={`
                  w-[2rem]
                  stroke-light-border-icon
                  dark:stroke-dark-border-icon
                `} 
              />
              {notificationState.newNotificationList.length > 0 && 
                  <div 
                    className='flex items-center justify-center absolute right-[0.75rem] top-0 min-w-[1rem] 
                    bg-light-warning text-light-white
                    dark:bg-dark-warning dark:text-dark-white
                    text-sm rounded-full'
                  >
                    {notificationState.newNotificationList.length}
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
              알림
            </div>
          </div>

          {/* 검색 */}
          <div 
            onClick={() => props.toggleExtendMenu('search')}
            className={`
              flex h-[3.5rem]
              hover:bg-light-gray
              dark:hover:bg-dark-gray
              cursor-pointer rounded-lg transition-colors
            `} 
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
          flex flex-col justify-between md:hidden h-full
          bg-light-white
          dark:bg-dark-white
          overflow-y-auto scrollbar-hide-mo
        `}
      >
        <div>
          {/* 프로필부분 */}
          <div
            className={`
              flex items-center justify-between h-[6.5rem] px-[1rem]
              bg-light-bgbasic dark:bg-dark-bgbasic
              rounded`}
          >
            <div className={`flex items-center w-full`}>
              <div 
                className={`
                  shrink-0 flex flex-all-center size-[2.7rem] me-[1rem]
                  border-light-border-2
                  dark:border-dark-border-2
                  overflow-hidden rounded-full border
                `}
              >
                <img 
                  src={user.profileImage || tempImage} 
                  alt="Profile" 
                  className={`size-full`}
                />
              </div>
              {user.isLoggedIn ? (
                <div className={`flex items-center justify-between w-full`}>
                  <Link to={`/user/${user.userId}`} onClick={props.closeMenu} className={`cursor-pointer transition-all duration-100 flex items-center truncate font-medium`}>
                    <p>{user.nickname}</p>
                    <LeftIcon
                      className='
                        size-[1.1rem] ms-[0.25rem]
                        fill-light-text
                        dark:fill-dark-text
                      '
                    />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="
                      ml-4 text-sm text-light-text-secondary dark:text-dark-text-secondary"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <div className={`flex items-center transition-all duration-100 truncate`}>
                  <Link to='/user/login' onClick={props.closeMenu}>
                    로그인 해주세요
                  </Link>
                  <LeftIcon
                    className='
                      size-[1.1rem] ms-[0.25rem]
                      fill-light-text
                      dark:fill-dark-text
                    '
                  />
                </div>
              )}
            </div>
          </div>

          {/* 하단 - 메뉴 */}
          <div className={`w-full px-[1.5rem] mt-[1.25rem]`}>
            {mobileMenuItems.map((item, index) => (
              <div key={index} className="mb-[1rem]">
                <div 
                  className={`
                    flex justify-between items-center h-[3.1rem] text-xl font-semibold cursor-pointer
                    ${expandedMenu === item.key ? 'bg-light-gray dark:bg-dark-gray' : ''}
                    rounded-md px-2 transition-colors duration-300
                  `}
                  onClick={() => item.subItems ? toggleMobileMenu(item.key) : (props.closeMenu(), item.linkTo && navigate(item.linkTo))}
                >
                  <span>{item.title}</span>
                  {item.subItems && (
                    <span className="text-2xl transition-transform duration-300 ease-in-out">
                      {expandedMenu === item.key ? '-' : '+'}
                    </span>
                  )}
                </div>
                <div 
                  className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${expandedMenu === item.key ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
                  `}
                >
                  {item.subItems && (
                    <div className="ps-[0.75rem] mt-[0.5rem]">
                      {item.key === 'rental' ? (
                        <div className="grid grid-cols-2 gap-4">
                          {item.subItems.map((subItem, subIndex) => (
                            <Link 
                              key={subIndex}
                              to={subItem.linkTo}
                              onClick={props.closeMenu}
                              className="flex flex-col items-center"
                            >
                              <div className="size-[4.2rem] rounded flex items-center justify-center mb-2 overflow-hidden">
                                {subItem.image && <img src={subItem.image} alt={subItem.title} className="size-full object-contain" />}
                              </div>
                              <span className="text-sm font-medium">{subItem.title}</span>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        item.subItems.map((subItem, subIndex) => (
                          <Link 
                            key={subIndex}
                            to={subItem.linkTo}
                            onClick={props.closeMenu}
                            className="block py-[0.5rem] text-lg px-[0.5rem] transition-colors"
                          >
                            {subItem.title}
                          </Link>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 다크모드 버튼 */}
        <div className='flex flex-all-center mb-[1.5rem]'>
          <p className='me-[1.5rem]'>다크모드설정</p>
          <DarkmodeBtn />
        </div>
      </div>
    </div>
  )
}

export default NavbarLeft