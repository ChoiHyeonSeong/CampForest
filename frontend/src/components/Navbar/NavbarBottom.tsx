import React from 'react'

type Props = {
  toggleMenu: () => void;
}

const NavbarBottom = (props: Props) => {
  return (
    <div className='fixed bottom-0 w-full h-10 flex md:hidden justify-between bg-slate-500'>
      <div className='bg-yellow-100'>
        <button onClick={props.toggleMenu}>1</button>
      </div>
      <div className='bg-yellow-200'>2</div>
      <div className='bg-yellow-300'>3</div>
      <div className='bg-yellow-400'>4</div>
      <div className='bg-yellow-500'>5</div>
    </div>
  )
}

export default NavbarBottom