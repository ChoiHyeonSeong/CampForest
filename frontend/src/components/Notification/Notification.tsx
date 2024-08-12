import React from 'react';
import userImage from '@assets/images/basic_profile.png'
import { NotificationType } from '@store/notificationSlice';
import { formatTime } from '@utils/formatTime';

type Props = {
  notification: NotificationType;
}

const Notification = ({notification}: Props) => {
  const renderNotificationContent = () => {
    switch(notification.notificationType) {
      case 'FOLLOW':
        return (
          <div className={`flex w-full items-center`}>
            <div className={`px-[0.75rem] text-sm`}>
              <span className={`font-bold`}>
                {notification.senderNickname}
              </span>
              <span>
                님이 회원님을 팔로우하기 시작했습니다.
              </span>
              <span className={`ms-[0.75rem] text-light-text-secondary dark:text-dark-text-secondary text-xs`}>
                {formatTime(notification.createdAt)}
              </span>
            </div>
            <div className={`
              shrink-0 px-[0.75rem] py-[0.35rem] 
              bg-light-signature text-light-white hover:bg-light-signature-hover dark:bg-dark-signature hover:dark:bg-dark-signature-hover
              text-[0.8rem] text-center rounded-md cursor-pointer`}>
              팔로우
            </div>
          </div>
        );
      case 'LIKE':
        return (
          <div className={`flex w-full items-center`}>
            <div className={`col-span-4 px-[0.75rem] text-sm`}>
              <span className={`font-bold`}>
                {notification.senderNickname}
              </span>
              <span>
                님 외 여러 명이 회원님의 게시글을 좋아합니다.
              </span>
              <span className={`ms-[0.75rem] text-light-text-secondary dark:text-dark-text-secondary text-xs`}>
                {formatTime(notification.createdAt)}
              </span>
            </div>
            <div className={`shrink-0 size-[2.75rem]`}>
              <img 
                src={userImage} 
                alt="NoImg" 
                className={`h-full border-light-border dark:border-dark-border border`}
              />
            </div>
          </div>
        );
        case 'COMMENT':
          return (
            <div className={`flex w-full items-center`}>
            <div className={`col-span-4 px-[0.75rem] text-sm`}>
              <span className={`font-bold`}>
                {notification.senderNickname}
              </span>
              <span>
                님이 회원님의 게시물에 댓글을 남겼습니다.
              </span>
              <span className={`ms-[0.75rem] text-light-text-secondary dark:text-dark-text-secondary text-xs`}>
                {formatTime(notification.createdAt)}
              </span>
            </div>
            <div className={`shrink-0 size-[2.75rem]`}>
              <img 
                src={userImage} 
                alt="NoImg" 
                className={`h-full border-light-border dark:border-dark-border border`}
              />
            </div>
          </div>
        )
        case 'SALE':
          return (
            <div className={`flex w-full items-center`}>
            <div className={`col-span-4 px-[0.75rem] text-sm`}>
              <span className={`font-bold`}>
                {notification.senderNickname}
              </span>
              <span>
                님이 판매를 요청하였습니다.
              </span>
              <span className={`ms-[0.75rem] text-light-text-secondary dark:text-dark-text-secondary text-xs`}>
                {formatTime(notification.createdAt)}
              </span>
            </div>
            <div className={`shrink-0 size-[2.75rem]`}>
              <img 
                src={userImage} 
                alt="NoImg" 
                className={`h-full border-light-border dark:border-dark-border border`}
              />
            </div>
          </div>
          )
        // 채팅 요청이 들어왔을 때(삭제 예정)
        case 'CHAT':
          return (
            <div className={`flex w-full items-center`}>
            <div className={`col-span-4 px-[0.75rem] text-sm`}>
              <span className={`font-bold`}>
                {notification.senderNickname}
              </span>
              <span>
                님이 채팅을 시작하였습니다.
              </span>
              <span className={`ms-[0.75rem] text-light-text-secondary dark:text-dark-text-secondary text-xs`}>
                {formatTime(notification.createdAt)}
              </span>
            </div>
            <div className={`shrink-0 size-[2.75rem]`}>
              <img 
                src={userImage} 
                alt="NoImg" 
                className={`h-full border-light-border dark:border-dark-border border`}
              />
            </div>
          </div>
          )
      default:
        return null;
    }
  };

  return (
    <div 
      className={`
        flex items-center p-[0.75rem] 
      bg-light-white border-light-border dark:bg-dark-white dark:border-dark-border 
        border-b overflow-hidden
      `}
    >
      {/* 사용자 이미지 */}
      <div className={`shrink-0 size-[2.5rem] rounded-full border overflow-hidden`}>
        <img 
          src={notification.senderProfileImage || userImage} 
          alt="User" 
          className={`fit cursor-pointer`}
        />
      </div>

      {renderNotificationContent()}
    </div>
  )
}

export default Notification;