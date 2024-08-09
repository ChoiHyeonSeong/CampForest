import React from 'react'
import Notification from './Notification';
import { RootState } from '@store/store';
import { useSelector } from 'react-redux';

const NotificationList = () => {
  const notificationState = useSelector((state: RootState) => state.notificationStore);
  return (
    <div className={`px-[0.75rem]`}>
      {notificationState.newNotificationList.length !== 0 &&
      <div 
        className='
          p-[0.5rem]
        '
      >
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
      <div className='p-[0.5rem]'>
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
  )
}

export default NotificationList;