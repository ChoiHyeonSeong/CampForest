import React from 'react'
import Notification from './items/Notification';

const NotificationList = () => {
  return (
    <div className='px-[2rem]'>
      <Notification />
      <Notification />
      <Notification />
      <Notification />
    </div>
  )
}

export default NotificationList;