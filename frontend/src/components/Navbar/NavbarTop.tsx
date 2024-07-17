import React from 'react'

type Props = {
  toggleMenu: () => void;
}

const NavbarTop = (props: Props) => {
  return (
    <div className='fixed w-full h-10 flex lg:hidden justify-between bg-slate-500'>
      <div className='bg-yellow-200'>
        <button className='hidden md:block' onClick={props.toggleMenu}>left toggle</button>
      </div>
      <div className='bg-blue-200'>center</div>
      <div className='bg-red-200'>right</div>
    </div>
  )
}

export default NavbarTop