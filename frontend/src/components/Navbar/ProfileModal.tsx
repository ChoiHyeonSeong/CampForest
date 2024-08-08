import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { logout } from '@services/authService';
import DefaultProfileImg from '@assets/images/basic_profile.png'

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ProfileModal = (props: Props) => {
  const user = useSelector((state: RootState) => state.userStore);
  
  const loggedout = async () => {
    await logout()
    window.location.reload();
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = DefaultProfileImg;
  };
  
  useEffect(() => {
    window.addEventListener('resize', props.onClose);
  }, []);

  return (
    <div 
      className={`
        ${props.isOpen ? 'block' : 'hidden'}
        absolute right-0 top-[3rem] z-[100] w-[16rem]
        bg-light-white
        dark:bg-dark-white
        rounded-lg shadow-lg
      `}
    >
      <div className={`relative p-[1rem]`}>
        <button onClick={props.onClose} className={`absolute top-[0.5rem] right-[0.5rem]`}>
          ×
        </button>
        <div className={`flex flex-col items-center`}>
          {user.isLoggedIn ? (
              <>
                <div className={`w-[5rem] h-[5rem] mb-[1rem] bg-light-gray dark:bg-dark-gray rounded-full overflow-hidden`}>
                  <img 
                    src={`${user.profileImage ? user.profileImage : DefaultProfileImg}`} 
                    alt="" 
                    onError={handleImageError}
                  />
                </div>
                <div className={`mb-[0.5rem] text-lg`}>{user.nickname}</div>
                <Link 
                  to={`/user/${user.userId}`} 
                  onClick={props.onClose} 
                  className={`mb-[1rem] text-light-anchor dark:text-dark-anchor`}
                >
                  마이페이지 보기
                </Link>
                <button 
                  onClick={loggedout} 
                  className={`px-[1rem] py-[0.5rem] border-light-border dark:border-dark-border border rounded-lg`}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/user/login" 
                  onClick={props.onClose} 
                  className={`px-[1rem] py-[0.5rem] cursor-pointer`}
                >
                  로그인 하러가기
                </Link>
              </>
            )
          }
          
        </div>
      </div>

    </div>
  );
};

export default ProfileModal;
