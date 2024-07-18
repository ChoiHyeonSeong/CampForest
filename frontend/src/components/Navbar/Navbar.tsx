import React, { useState, useEffect } from 'react';
import NavbarTop from './NavbarTop';
import NavbarLeft from './NavbarLeft';
import NavbarLeftExtendRental from './NavbarLeftExtendRental';
import NavbarLeftExtendCommunity from './NavbarLeftExtendCommunity';
import NavbarBottom from './NavbarBottom';
import Aside from './Aside';

const Navbar = () => {

  // Menu 상태 관리 (메뉴 열기, 닫기)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  // 확장 Menu 상태 관리 (확장메뉴 열기, 닫기)
  const [isExtendRentalOpen, setIsExtendRentalOpen] = useState<boolean>(false);
  const [isExtendCommunityOpen, setisExtendCommunityOpen] = useState<boolean>(false);
  // 선택된 확장 Menu 카테고리
  const [selectedExtendMenu, setSelectedExtendMenu] = useState<string | null>(null);

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
    setIsExtendRentalOpen(false);
    setisExtendCommunityOpen(false);
  };

  const toggleExtendMenu = (selectedCategory: string): void => {
    setSelectedExtendMenu(selectedCategory);

    if (selectedCategory === 'rental') {
      if (isExtendRentalOpen) {
        setIsExtendRentalOpen(false)
      } else {
        setisExtendCommunityOpen(false)
        setIsExtendRentalOpen(true)
      }
    } else if (selectedCategory === 'community') {
      if (isExtendCommunityOpen) {
        setisExtendCommunityOpen(false)
      } else {
        setIsExtendRentalOpen(false)
        setisExtendCommunityOpen(true)
      }
    };
  };

  useEffect(() => {
    // 화면 줄어들면 Menu 강제로 닫기
    const handleResize = () => {
      setIsMenuOpen(false);
      setIsExtendRentalOpen(false);
      setisExtendCommunityOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {

  }, [selectedExtendMenu]);

  return (
    <div className='h-11 lg:h-0'>

      {/* 상단 네비게이션바 */}
      <NavbarTop toggleMenu={toggleMenu}/>

      {/* 좌측 메뉴바 */}
      <NavbarLeft 
        isMenuOpen={isMenuOpen} toggleExtendMenu={toggleExtendMenu} 
        toggleMenu={toggleMenu} isExtendRentalOpen={isExtendRentalOpen} isExtendCommunityOpen={isExtendCommunityOpen}
      />

      {/* 좌측 메뉴바 확장 */}
      <NavbarLeftExtendRental isExtendMenuOpen={isExtendRentalOpen} toggleExtendMenu={toggleExtendMenu}/>
      <NavbarLeftExtendCommunity isExtendMenuOpen={isExtendCommunityOpen} toggleExtendMenu={toggleExtendMenu}/>

      {/* 모바일용 하단 네비게이션바 */}
      <NavbarBottom toggleMenu={toggleMenu}/>

      {/* 우측 하단 고정사이드바 */}
      <Aside />
    </div>
  )
}

export default Navbar