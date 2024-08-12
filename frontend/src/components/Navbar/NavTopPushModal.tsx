
import React, { useEffect }  from 'react'
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg'
import Notification from '@components/Notification/Notification';
import { logout } from '@services/authService';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};


const NavTopPushModal = (props: Props) => {
  const notificationState = useSelector((state: RootState) => state.notificationStore);
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
        absolute right-0 top-[3rem] z-[100] w-[23rem] max-h-[40rem] p-[0.75rem]
        bg-light-white
        dark:bg-dark-white
        rounded-lg shadow-lg overflow-scroll
      `}
    >

<CloseIcon
          onClick={props.onClose}
          className='
            absolute size-[1.5rem] right-0
            fill-light-border-icon
            dark:fill-dark-border-icon
            cursor-pointer
          '
        />
      <div className='rounded overflow-hidden'>
      {notificationState.newNotificationList.length !== 0 &&
      <div>
        <div>
          새로운 알림
          <span 
            className='
              ms-[0.5rem]
              font-semibold
            '
          >
            {notificationState.newNotificationList.length}
          </span>
        </div>
        <div>
          {notificationState.newNotificationList.map((newNotification) => (
            <Notification
              key={newNotification.notificationId}
              notification={newNotification}  
            />
          ))}
        </div>
      </div>
      }
      <div>
        <div>
          지난 알림
          <span 
            className='
              ms-[0.5rem]
              font-semibold
            '
          >
            {notificationState.notificationList.length}
          </span>
        </div>
        <div>
          {notificationState.notificationList.map((notification) => (
            <Notification 
              key={notification.notificationId}
              notification={notification}  
            />
          ))}
        </div>
      </div>
      </div>
      

    </div>
  )
}

export default NavTopPushModal