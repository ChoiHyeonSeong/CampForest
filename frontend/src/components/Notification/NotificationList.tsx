import React from 'react'
import Notification from './Notification';

const NotificationList = () => {
  return (
    <div className={`px-[0.75rem]`}>
      <Notification />
      <Notification />
      <Notification />
      <Notification />
    </div>
  )
}

export default NotificationList;