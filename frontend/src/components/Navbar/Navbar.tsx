import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@store/store';
import { setUser, clearUser } from '@store/userSlice';

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
  const dispatch = useDispatch();

  // Menu 상태 관리 (메뉴 열기, 닫기)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isMenuBlocked, setIsMenuBlocked] = useState<boolean>(false);
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
    // 화면 줄어들면 Menu 강제로 닫기
    const handleAllMenu = () => {
      setIsMenuOpen(false);
      setIsExtendRentalOpen(false);
      setisExtendCommunityOpen(false);
      setIsExtendChatListOpen(false);
      setIsExtendNotificationOpen(false);
      setIsExtendSearchOpen(false);
      setIsMenuBlocked(false);
    };

    const contentBox = document.querySelector('#contentBox') as HTMLElement;
    contentBox.addEventListener('click', closeMenu);
    
    window.addEventListener('resize', handleAllMenu);

    const storedIsLoggedIn = sessionStorage.getItem('isLoggedIn');
    const similarUsersString = sessionStorage.getItem('similarUsers');
    let similarUsers: object = {};
    if (similarUsersString) {
      try {
        similarUsers = JSON.parse(similarUsersString);
      } catch (error) {
        console.error('Failed to parse similarUsers: ', error);
      }
    } 
    if (storedIsLoggedIn === 'true') {
      const storageObj = {
        userId: Number(sessionStorage.getItem('userId')),
        nickname: sessionStorage.getItem('nickname') || '',
        profileImage: sessionStorage.getItem('profileImage') || '',
        similarUsers: similarUsers || {test: '123'},
      }
      dispatch(setUser(storageObj));
    } else {
      dispatch(clearUser());
    }
    
    console.log('페이지 접속')
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  useEffect(() => {
    if (isMenuBlocked) {
      setIsMenuOpen(true);
    }
  }, [isMenuBlocked]);

  const handleTransitionEnd = () => {
    if (!isMenuOpen) {
      setIsMenuBlocked(false);
    }
  };

  // 스크롤 방지
  const currentScrollY = useRef(0);
  const isAnyModalOpened = useRef(false);
  useEffect(() => {
    // 스크롤 방지는 media width가 1024 이하일때만
    const lgQuery = window.matchMedia('(min-width: 1024px)');
    const contentBox = document.querySelector('#contentBox') as HTMLElement;

    if (isMenuOpen) {
      if (!contentBox.style.top) {
        currentScrollY.current = window.scrollY;
        isAnyModalOpened.current = false
      } else {
        currentScrollY.current = parseInt(contentBox.style.top.replace('-', '').replace('px', ''));
        isAnyModalOpened.current = true
      };
    };

    if (isMenuOpen && !lgQuery.matches) {
      // 모달이 열릴 때 스크롤 방지
      contentBox.classList.add('no-scroll');
      contentBox.style.top = `-${currentScrollY.current}px`;
    } else if (!isMenuOpen && !lgQuery.matches) {
        // 모달이 닫힐 때 스크롤 허용
        const scrollY = parseInt(contentBox.style.top || '0') * -1;
        if (!isAnyModalOpened.current) {
          contentBox.classList.remove('no-scroll');
          contentBox.style.top = '';
        };
      window.scrollTo(0, scrollY || currentScrollY.current);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
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
      <div>
        <NavbarLeftExtendRental isExtendMenuOpen={isExtendRentalOpen} toggleExtendMenu={toggleExtendMenu} closeMenu={closeMenu}/>
        <NavbarLeftExtendCommunity isExtendMenuOpen={isExtendCommunityOpen} toggleExtendMenu={toggleExtendMenu} closeMenu={closeMenu}/>
        <NavbarLeftExtendChatList isExtendMenuOpen={isExtendChatListOpen} toggleExtendMenu={toggleExtendMenu} />
        <NavbarLeftExtendNotification isExtendMenuOpen={isExtendNotificationOpen} toggleExtendMenu={toggleExtendMenu} />
        <NavbarLeftExtendSearch isExtendMenuOpen={isExtendSearchOpen} toggleExtendMenu={toggleExtendMenu} />
      </div>
      {/* 모바일용 하단 네비게이션바 */}
      <NavbarBottom toggleMenu={toggleMenu} closeMenu={closeMenu}/>

      {/* 우측 하단 고정사이드바 */}
      <Aside user={user} />

      {/* 태블릿 이하 사이즈에서 메뉴 열때 배경 회색처리 */}
      <div
        onClick={closeMenu}
        className={`
          ${isMenuOpen ? 'block lg:hidden fixed inset-0 bg-light-black bg-opacity-80 dark:bg-dark-black dark:bg-opacity-80' : 'hidden bg-none'}
          z-[30]
        `}
      >
      </div>
    </div>
  )
}

export default Navbar