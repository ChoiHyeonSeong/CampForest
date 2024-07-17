import React from 'react'
import tempImage from '@assets/logo192.png';

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
      className={`fixed z-10 w-56 h-full md:mt-10 lg:mt-0 mb-10 md:mb-0 
        lg:translate-x-0 transition-all duration-300 ease-in-out
        ${props.isMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        ${isEitherOpen ? 'w-[4rem]' : 'w-56'} 
        bg-amber-500`
      }
    >
      {/* desktop tablet */}
      <div className='h-full hidden md:flex flex-col justify-between'>
        {/* main menu */}
        <div>
          <div className='bg-gray-600 h-20 flex'>
            <div className='w-[4rem] flex flex-all-center'>
              <img src={tempImage} alt="NoImg" className='h-8'/>
            </div>
            <div className={`${isEitherOpen ? 'hidden' : 'block'} flex flex-all-center`}>로고 들어갑니다</div>
          </div>

          <div className='bg-gray-100 h-16 flex'>
            <div className='w-[4rem] flex flex-all-center'>
              <img src={tempImage} alt="NoImg" className={`${isEitherOpen ? 'hidden' : 'block'} h-8`}/>
            </div>
            <div className={`${isEitherOpen ? 'hidden' : 'block'} flex flex-all-center`}>프로필 들어갑니다</div>
          </div>

          <div className='bg-gray-600 h-12 flex cursor-pointer' onClick={() => props.toggleExtendMenu('rental')}>
            <div className='w-[4rem] flex flex-all-center'>
              <img src={tempImage} alt="NoImg" className='h-8'/>
            </div>
            <div className={`${isEitherOpen ? 'hidden' : 'block'} flex flex-all-center`}>대여 / 판매</div>
          </div>
          <div className='bg-gray-600 h-12 flex cursor-pointer' onClick={() => props.toggleExtendMenu('community')}>
            <div className='w-[4rem] flex flex-all-center'>
              <img src={tempImage} alt="NoImg" className='h-8'/>
            </div>
            <div className={`${isEitherOpen ? 'hidden' : 'block'} flex flex-all-center`}>커뮤니티</div>
          </div>
          <div className='bg-gray-600 h-12 flex'>
            <div className='w-[4rem] flex flex-all-center'>
              <img src={tempImage} alt="NoImg" className='h-8'/>
            </div>
            <div className={`${isEitherOpen ? 'hidden' : 'block'} flex flex-all-center`}>캠핑장 찾기</div>
          </div>
          <div className='bg-gray-600 h-12 flex'>
            <div className='w-[4rem] flex flex-all-center'>
              <img src={tempImage} alt="NoImg" className='h-8'/>
            </div>
            <div className={`${isEitherOpen ? 'hidden' : 'block'} flex flex-all-center`}>채팅</div>
          </div>
          <div className='bg-gray-600 h-12 flex'>
            <div className='w-[4rem] flex flex-all-center'>
              <img src={tempImage} alt="NoImg" className='h-8'/>
            </div>
            <div className={`${isEitherOpen   ? 'hidden' : 'block'} flex flex-all-center`}>알림</div>
          </div>
          <div className='bg-gray-600 h-12 flex'>
            <div className='w-[4rem] flex flex-all-center'>
              <img src={tempImage} alt="NoImg" className='h-8'/>
            </div>
            <div className={`${isEitherOpen ? 'hidden' : 'block'} flex flex-all-center`}>검색</div>
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