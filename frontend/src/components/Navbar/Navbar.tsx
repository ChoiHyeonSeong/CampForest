import React, { useState, useEffect } from 'react';
import NavbarTop from './NavbarTop';
import NavbarLeft from './NavbarLeft';
import NavbarLeftExtendRental from './NavbarLeftExtendRental';
import NavbarLeftExtendCommunity from './NavbarLeftExtendCommunity';
import NavbarBottom from './NavbarBottom';

type Props = {}

const Navbar = (props: Props) => {

  // Menu 상태 관리 (메뉴 열기, 닫기)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // 확장 Menu 상태 관리 (확장메뉴 열기, 닫기)
  const [isExtendRentalOpen, setIsExtendRentalOpen] = useState(false);
  const [isExtendCommunityOpen, setisExtendCommunityOpen] = useState(false);
  // 선택된 확장 Menu 카테고리
  const [selectedExtendMenu, setSelectedExtendMenu] = useState<string | null>(null);

  const isEitherOpen = (isExtendRentalOpen || isExtendCommunityOpen);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsExtendRentalOpen(false);
    setisExtendCommunityOpen(false);
  };

  const toggleExtendMenu = (selectedCategory:string) => {
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
      if (window.innerWidth >= 768 || window.innerWidth >= 1024) {
        setIsMenuOpen(false);
        setIsExtendRentalOpen(false);
        setisExtendCommunityOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {

  }, [selectedExtendMenu]);

  return (
    <div className='h-10 lg:h-0'>

      {/* 상단 네비게이션바 */}
      <NavbarTop toggleMenu={toggleMenu}/>

      {/* 좌측 메뉴바 */}
      <NavbarLeft isMenuOpen={isMenuOpen} toggleExtendMenu={toggleExtendMenu} 
        toggleMenu={toggleMenu} isExtendRentalOpen={isExtendRentalOpen} isExtendCommunityOpen={isExtendCommunityOpen}/>

      {/* 좌측 메뉴바 확장 */}
      <NavbarLeftExtendRental isExtendMenuOpen={isExtendRentalOpen}/>
      <NavbarLeftExtendCommunity isExtendMenuOpen={isExtendCommunityOpen}/>

      {/* 모바일용 하단 네비게이션바 */}
      <NavbarBottom toggleMenu={toggleMenu}/>
    </div>
  )
}

export default Navbar