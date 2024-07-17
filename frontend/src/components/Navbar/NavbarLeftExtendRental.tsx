import React from 'react'

type Props = {
  isExtendMenuOpen: boolean;
}

const NavbarLeftExtendRental = (props: Props) => {
  return (
    <div
      className={`fixed w-[25rem] h-full md:mt-10 lg:mt-0 mb-10 md:mb-0 
        transition-all duration-300 ease-in-out 
        ${props.isExtendMenuOpen ? 'translate-x-[5rem]' : '-translate-x-full'} 
        bg-gray-500`
      }
    >
      <div className='bg-orange-500 h-20 ms-4 flex items-center'>Rental</div>
      <div className="grid grid-cols-2 grid-rows-5 gap-4 p-4">
        <div className="bg-gray-200 p-4">1</div>
        <div className="bg-gray-200 p-4">2</div>
        <div className="bg-gray-200 p-4">3</div>
        <div className="bg-gray-200 p-4">4</div>
        <div className="bg-gray-200 p-4">5</div>
        <div className="bg-gray-200 p-4">6</div>
        <div className="bg-gray-200 p-4">7</div>
        <div className="bg-gray-200 p-4">8</div>
        <div className="bg-gray-200 p-4">9</div>
        <div className="bg-gray-200 p-4">10</div>
      </div>
    </div>
  )
}

export default NavbarLeftExtendRental