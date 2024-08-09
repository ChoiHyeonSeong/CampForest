
import React, { useEffect }  from 'react'
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg'
import Notification from '@components/Notification/Notification';
import { logout } from '@services/authService';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};


const NavTopPushModal = (props: Props) => {

  const loggedout = async () => {
    await logout()
    window.location.reload();
  }
  useEffect(() => {
    window.addEventListener('resize', props.onClose);
  }, []);



  return (
    <div 
      className={`
        ${props.isOpen ? 'block' : 'hidden'}
        absolute right-0 top-[3rem] z-[100] w-[20rem] max-h-[40rem] p-[0.75rem]
        bg-light-bgbasic
        dark:bg-dark-bgbasic
        rounded-lg shadow-lg overflow-hidden
      `}
    >
      {/* 상단 */}
      <div className='flex justify-between'>
        <p
          className='
            mb-[0.75rem]
            
            text-xl font-semibold
          '
        >
          알림
        </p>
        <CloseIcon
          onClick={props.onClose}
          className='
            ize-[1.5rem]
            fill-light-border-icon
            dark:fill-dark-border-icon
            cursor-pointer
          '
        />
      </div>

      <div className='rounded overflow-hidden'>
      </div>
      

    </div>
  )
}

export default NavTopPushModal