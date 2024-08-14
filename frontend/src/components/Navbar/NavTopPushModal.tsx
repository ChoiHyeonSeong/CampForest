
import React, { useEffect, useState }  from 'react'
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg'
import { ReactComponent as ArrowLeftIcon } from '@assets/icons/arrow-left.svg'
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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  const loggedout = async () => {
    await logout()
    window.location.reload();
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        props.onClose();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [props.onClose]);

  useEffect(() => {
    if (isMobile && props.isOpen) {
      window.history.pushState(null, '', window.location.href);
      window.addEventListener('popstate', props.onClose);
      return () => window.removeEventListener('popstate', props.onClose);
    }
  }, [isMobile, props.isOpen, props.onClose]);

  if (!props.isOpen) return null;

  return (
    <div 
      className={`
        fixed inset-0 z-[100] max-md:h-[calc(100vh-3.2rem)]
        ${isMobile ? 'flex justify-end' : ''}
      `}
      onClick={props.onClose}
    >
      <div 
        className={`
          ${isMobile ? 'w-full h-full' : 'absolute right-0 top-[3rem] w-[23rem] max-h-[40rem]'}
          bg-light-white dark:bg-dark-white
          overflow-scroll
          ${isMobile ? 'animate-slideIn' : ''}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {isMobile ? (
          <div className="flex items-center p-4 border-b">
            <ArrowLeftIcon onClick={props.onClose} className="w-6 h-6 mr-2 cursor-pointer" />
            <h2 className="text-lg font-semibold">알림</h2>
          </div>
        ) : (
          <CloseIcon
            onClick={props.onClose}
            className='
              absolute size-[1.5rem] right-4 top-4
              fill-light-border-icon
              dark:fill-dark-border-icon
              cursor-pointer
            '
          />
        )}

        <div className='p-4'>
          {notificationState.newNotificationList.length !== 0 &&
            <div className="mb-4">
              <h3 className="font-semibold mb-2">
                새로운 알림
                <span className="ml-2 font-normal">
                  {notificationState.newNotificationList.length}
                </span>
              </h3>
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
            <h3 className="font-semibold mb-2">
              지난 알림
              <span className="ml-2 font-normal">
                {notificationState.notificationList.length}
              </span>
            </h3>
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
    </div>
  )
}

export default NavTopPushModal