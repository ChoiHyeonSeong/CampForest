import React, { useState } from 'react'

// icon import
import { ReactComponent as WriteIcon } from '@assets/icons/write.svg'
import { ReactComponent as TopBtnIcon } from '@assets/icons/top-btn.svg'
import { ReactComponent as DotIcon } from '@assets/icons/more-dots.svg'
import { ReactComponent as RentalIcon } from '@assets/icons/nav-rental.svg'
import { ReactComponent as CommunityIcon } from '@assets/icons/nav-community.svg'
import { useDispatch } from 'react-redux'
import { setIsBoardWriteModal } from '@store/modalSlice'
import { RootState } from '@store/store'
import { Link } from 'react-router-dom'

type Props = {
  user: RootState['userStore'];
}

const Aside = (props: Props) => {
  const dispatch = useDispatch();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleExpand = (): void => {
    setIsExpanded(!isExpanded);
  };

  const scrollToTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <aside className='fixed bottom-14 right-5 md:bottom-8 md:right-5 z-10'>
      <div className={`${props.user.isLoggedIn ? '' : 'hidden'} flex items-center mb-2 relative`}>
        <div className='flex absolute right-2'>
          <Link onClick={toggleExpand} to='product/write' 
            className={`w-11 h-11 bg-black rounded-full flex flex-all-center transition-all duration-300 ease-in-out 
              ${isExpanded ? 'opacity-100 -translate-x-full hover:bg-[#FF6B00]' : 'opacity-0 -translate-x-0 pointer-events-none'}
              delay-100
              `}
          >
            <RentalIcon className='stroke-white'/>
          </Link>
          <div 
            onClick={() => {
              dispatch(setIsBoardWriteModal(true))
              toggleExpand()}}
            className={`w-11 h-11 bg-black rounded-full flex flex-all-center ml-2 transition-all duration-300 ease-in-out 
              ${isExpanded ? 'opacity-100 -translate-x-full hover:bg-[#FF6B00]' : 'opacity-0 -translate-x-0 pointer-events-none'}`}
          >
            <CommunityIcon className='stroke-white'/>
          </div>
        </div>

        <div 
          className={`w-11 h-11 bg-black rounded-full flex flex-all-center hover:bg-[#FF6B00] duration-200 transition-all z-10`}
          onClick={toggleExpand}
        >
          {isExpanded ? <DotIcon className='fill-white rotate-90'/> : <WriteIcon className='stroke-white'/>}
        </div>
      </div>

      <div 
        className='w-11 h-11 bg-black rounded-full flex flex-all-center hover:bg-[#FF6B00] duration-200'
        onClick={scrollToTop}
      >
          <TopBtnIcon />
      </div>
    </aside>
  )
}

export default Aside