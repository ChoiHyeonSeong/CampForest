import React from 'react'

type Props = {
  isExtendMenuOpen: boolean;
}

const NavbarLeftExtendCommunity = (props: Props) => {
  return (
    <div
      className={`fixed w-[18rem] h-full md:mt-10 lg:mt-0 mb-10 md:mb-0 
        transition-all duration-300 ease-in-out 
        ${props.isExtendMenuOpen ? 'translate-x-[4rem]' : '-translate-x-full'} 
        bg-gray-500`
      }
    >
      <div className='bg-orange-500 h-20'>Community</div>
      <div className='flex flex-col text-left'>
        <div className="bg-gray-200 p-4">1</div>
        <div className="bg-gray-200 p-4">2</div>
        <div className="bg-gray-200 p-4">3</div>
        <div className="bg-gray-200 p-4">4</div>
        <div className="bg-gray-200 p-4">5</div>
        <div className="bg-gray-200 p-4">6</div>
        <div className="bg-gray-200 p-4">7</div>
      </div>
    </div>
  )
}

export default NavbarLeftExtendCommunity