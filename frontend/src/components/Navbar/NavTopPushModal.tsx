import React, { useEffect, useState } from 'react';
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg';
import { ReactComponent as ArrowLeftIcon } from '@assets/icons/arrow-left.svg';
import Notification from '@components/Notification/Notification';
import { logout } from '@services/authService';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { useNavigate } from 'react-router-dom';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const NavTopPushModal = (props: Props) => {
  const navigate = useNavigate();
  const notificationState = useSelector((state: RootState) => state.notificationStore);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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

  const handleBackButton = (event: PopStateEvent) => {
    event.preventDefault();
    props.onClose();
  };

  useEffect(() => {
    // 컴포넌트 마운트 시 이벤트 리스너 추가
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handleBackButton);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, []);

  return (
    <div
      className={`
        ${props.isOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full opacity-0 pointer-events-none'}
        fixed
        ${isMobile ? 'w-screen h-screen inset-0 bg-light-white dark:bg-dark-white' : 'w-[23rem] right-[1rem] top-[4rem] lg:right-[1rem] lg:top-[3rem]'}
        bg-light-white
        dark:bg-dark-white
        rounded-lg shadow-lg transition-all duration-300 ease-out
      `}
    >
      <div
        className={`
          ${isMobile ? 'h-[calc(100vh-3.2rem)] bg-light-white dark:bg-dark-white' : 'max-h-[40rem] bg-light-gray dark:bg-dark-gray'}
          rounded scrollbar-hide-mo
          overflow-scroll
          ${isMobile ? 'animate-slideIn' : ''}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {isMobile ? (
          <div className="flex items-center p-4 md:border-b fixed top-0 w-full bg-light-white dark:bg-dark-white">
            <ArrowLeftIcon
              onClick={props.onClose}
              className="w-6 h-6 mr-2 cursor-pointer fill-light-text dark:fill-dark-text"
            />
            <h2 className="text-lg font-semibold">알림</h2>
          </div>
        ) : (
          <div className='flex items-center fixed h-[3rem] w-full bg-light-white dark:bg-dark-white border-b rounded-t-lg'>
            <div className='ms-[1.5rem]'>
              알람
            </div>
            
            <CloseIcon
              onClick={props.onClose}
              className='
                absolute size-[1.5rem] right-4 top-[0.7rem]
                fill-light-border-icon
                dark:fill-dark-border-icon
                cursor-pointer
              '
            />
          </div>
        )}

        <div className="max-md:mt-[3.2rem] p-4">
          {notificationState.newNotificationList.length !== 0 && (
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
          )}
          <div>
            <h3 className="font-semibold mb-2">
              지난 알림
              <span className="ml-2 font-normal">{notificationState.notificationList.length}</span>
            </h3>
            <div>
              {notificationState.notificationList.map((notification) => (
                <Notification key={notification.notificationId} notification={notification} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    // <div
    //   className={`
    //     fixed inset-0 z-[100] max-md:h-[calc(100vh-3.2rem)]
    //     ${isMobile ? 'flex justify-end' : ''}
    //   `}
    //   onClick={props.onClose}
    // >
    //   <div
    //     className={`
    //       ${isMobile ? 'w-full h-full bg-light-white dark:bg-dark-white' : 'absolute right-0 top-[3rem] w-[23rem] max-h-[40rem]'}
    //       bg-light-gray dark:bg-dark-gray rounded scrollbar-hide
    //       overflow-scroll
    //       ${isMobile ? 'animate-slideIn' : ''}
    //     `}
    //     onClick={(e) => e.stopPropagation()}
    //   >
    //     {isMobile ? (
    //       <div className="flex items-center p-4 border-b">
    //         <ArrowLeftIcon onClick={props.onClose} className="w-6 h-6 mr-2 cursor-pointer fill-light-text dark:fill-dark-text" />
    //         <h2 className="text-lg font-semibold">알림</h2>
    //       </div>
    //     ) : (
    //       <CloseIcon
    //         onClick={props.onClose}
    //         className='
    //           absolute size-[1.5rem] right-4 top-4
    //           fill-light-border-icon
    //           dark:fill-dark-border-icon
    //           cursor-pointer
    //         '
    //       />
    //     )}

    //     <div className='p-4'>
    //       {notificationState.newNotificationList.length !== 0 &&
    //         <div className="mb-4">
    //           <h3 className="font-semibold mb-2">
    //             새로운 알림
    //             <span className="ml-2 font-normal">
    //               {notificationState.newNotificationList.length}
    //             </span>
    //           </h3>
    //           <div>
    //             {notificationState.newNotificationList.map((newNotification) => (
    //               <Notification
    //                 key={newNotification.notificationId}
    //                 notification={newNotification}
    //               />
    //             ))}
    //           </div>
    //         </div>
    //       }
    //       <div>
    //         <h3 className="font-semibold mb-2">
    //           지난 알림
    //           <span className="ml-2 font-normal">
    //             {notificationState.notificationList.length}
    //           </span>
    //         </h3>
    //         <div>
    //           {notificationState.notificationList.map((notification) => (
    //             <Notification
    //               key={notification.notificationId}
    //               notification={notification}
    //             />
    //           ))}
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default NavTopPushModal;