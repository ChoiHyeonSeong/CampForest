import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';

import NavbarTop from './NavbarTop';
import NavbarLeft from './NavbarLeft';
import NavbarLeftExtendRental from './NavbarLeftExtendRental';
import NavbarLeftExtendCommunity from './NavbarLeftExtendCommunity';
import NavbarLeftExtendChatList from './NavbarLeftExtendChat';
import NavbarLeftExtendNotification from './NavbarLeftExtendNotification'
import NavbarLeftExtendSearch from './NavbarLeftExtendSearch'
import Chat from '@components/Chat/Chat';
import NavbarBottom from './NavbarBottom';
import Aside from './Aside';

const Navbar = () => {
  const user = useSelector((state: RootState) => state.userStore);

  // Menu 상태 관리 (메뉴 열기, 닫기)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isMenuBlocked, setIsMenuBlocked] = useState<boolean>(true);
  // 확장 Menu 상태 관리 (확장메뉴 열기, 닫기)
  const [isExtendRentalOpen, setIsExtendRentalOpen] = useState<boolean>(false);
  const [isExtendCommunityOpen, setisExtendCommunityOpen] = useState<boolean>(false);
  const [isExtendChatListOpen, setIsExtendChatListOpen] = useState<boolean>(false);
  const [isExtendNotificationOpen, setIsExtendNotificationOpen] = useState<boolean>(false);
  const [isExtendSearchOpen, setIsExtendSearchOpen] = useState<boolean>(false);

  const toggleMenu = (): void => {
    if(isMenuOpen) {
      setIsMenuOpen(false);
    } else {
      // setIsMenuOpen(true)
      setIsMenuBlocked(true);
    }
    setIsExtendRentalOpen(false);
    setisExtendCommunityOpen(false);
    setIsExtendChatListOpen(false);
    setIsExtendNotificationOpen(false);
    setIsExtendSearchOpen(false);
  };

  const closeMenu = (): void => {
    setIsMenuOpen(false)
    setIsExtendRentalOpen(false);
    setisExtendCommunityOpen(false);
    setIsExtendChatListOpen(false);
    setIsExtendNotificationOpen(false);
    setIsExtendSearchOpen(false);
  }

  const toggleExtendMenu = (selectedCategory: string): void => {
    if (selectedCategory === 'rental') {
      if (isExtendRentalOpen) {
        setIsExtendRentalOpen(false)
      } else {
        setisExtendCommunityOpen(false)
        setIsExtendChatListOpen(false)
        setIsExtendNotificationOpen(false)
        setIsExtendSearchOpen(false)
        setIsExtendRentalOpen(true)
      }
    } else if (selectedCategory === 'community') {
      if (isExtendCommunityOpen) {
        setisExtendCommunityOpen(false)
      } else {
        setIsExtendRentalOpen(false)
        setIsExtendChatListOpen(false)
        setIsExtendNotificationOpen(false)
        setIsExtendSearchOpen(false)
        setisExtendCommunityOpen(true)
      }
    } else if (selectedCategory === 'chat') {
      if (isExtendChatListOpen) {
        setIsExtendChatListOpen(false)
      } else {
        setIsExtendRentalOpen(false)
        setisExtendCommunityOpen(false)
        setIsExtendNotificationOpen(false)
        setIsExtendSearchOpen(false)
        setIsExtendChatListOpen(true)
      }
    } else if (selectedCategory === 'notification') {
      if (isExtendNotificationOpen) {
        setIsExtendNotificationOpen(false);
      } else {
        setIsExtendRentalOpen(false)
        setisExtendCommunityOpen(false)
        setIsExtendChatListOpen(false)
        setIsExtendSearchOpen(false)
        setIsExtendNotificationOpen(true)
      }
    } else if (selectedCategory === 'search') {
      if (isExtendSearchOpen) {
        setIsExtendSearchOpen(false);
      } else {
        setIsExtendRentalOpen(false)
        setisExtendCommunityOpen(false)
        setIsExtendChatListOpen(false)
        setIsExtendNotificationOpen(false)
        setIsExtendSearchOpen(true)
      }
    };
  };

  useEffect(() => {
    const lgQuery = window.matchMedia('(min-width: 1024px)');

    // 화면 줄어들면 Menu 강제로 닫기
    const handleResize = () => {
      setIsMenuOpen(false);
      setIsExtendRentalOpen(false);
      setisExtendCommunityOpen(false);
      setIsExtendChatListOpen(false);
      setIsExtendNotificationOpen(false);
      setIsExtendSearchOpen(false);
      if (lgQuery.matches) {
        setIsMenuBlocked(true);
      } else {
        setIsMenuBlocked(false);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const lgQuery = window.matchMedia('(min-width: 1024px)');

    if (isMenuBlocked && !lgQuery.matches) {
      setIsMenuOpen(true);
    }
  }, [isMenuBlocked]);

  const handleTransitionEnd = () => {
    const lgQuery = window.matchMedia('(min-width: 1024px)');

    if (!isMenuOpen && !lgQuery.matches) {
      setIsMenuBlocked(false);
    }
  };

  // 스크롤 방지
  useEffect(() => {
    if (isMenuOpen) {
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
  }, [isMenuOpen]);

  return (
    <div>

      {/* 상단 네비게이션바 */}
      <NavbarTop toggleMenu={toggleMenu} closeMenu={closeMenu}/>

      {/* 좌측 메뉴바 */}
      <NavbarLeft 
        isMenuOpen={isMenuOpen} toggleExtendMenu={toggleExtendMenu} user={user} closeMenu={closeMenu}
        toggleMenu={toggleMenu} isExtendRentalOpen={isExtendRentalOpen} isExtendCommunityOpen={isExtendCommunityOpen}
        isExtendChatOpen={isExtendChatListOpen} isExtendNotificationOpen={isExtendNotificationOpen}
        isExtendSearchOpen={isExtendSearchOpen} isMenuBlocked={isMenuBlocked} handleTransitionEnd={handleTransitionEnd}
      />

      {/* 좌측 메뉴바 확장 */}
      <div className='pt-[3.2rem]'>
        <NavbarLeftExtendRental isExtendMenuOpen={isExtendRentalOpen} toggleExtendMenu={toggleExtendMenu}/>
        <NavbarLeftExtendCommunity isExtendMenuOpen={isExtendCommunityOpen} toggleExtendMenu={toggleExtendMenu}/>
        <NavbarLeftExtendChatList isExtendMenuOpen={isExtendChatListOpen} toggleExtendMenu={toggleExtendMenu} />
        <Chat isExtendMenuOpen={isExtendChatListOpen} toggleExtendMenu={toggleExtendMenu} />
        <NavbarLeftExtendNotification isExtendMenuOpen={isExtendNotificationOpen} toggleExtendMenu={toggleExtendMenu} />
        <NavbarLeftExtendSearch isExtendMenuOpen={isExtendSearchOpen} toggleExtendMenu={toggleExtendMenu} />
      </div>
      {/* 모바일용 하단 네비게이션바 */}
      <NavbarBottom toggleMenu={toggleMenu} closeMenu={closeMenu}/>

      {/* 우측 하단 고정사이드바 */}
      <Aside user={user} />
    </div>
  )
}

export default Navbar