import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as LeftArrow } from '@assets/icons/arrow-left.svg'
import UserInformation from '@components/User/UserInformation'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { registClear, registOptional } from '@store/registSlice';
import { userGetProfile, userUpdateProfile } from '@services/userService';
import { setUser } from '@store/userSlice';

type Props = {}

type Interests = {
  interestId: number;
  interest: string;
}

type OriginalData = {
  birthdate: string;
  gender: string;
  interests: Interests[];
  introduction: string;
  nickname: string;
  open: boolean;
  profileImage: string;
  userId: number;
}

type RegistOptional = {
  profileImage: string | null,
  nickname: string,
  userBirthdate: string | null | undefined,
  userGender: string,
  introduction: string,
  interests: string[] | null
}

const ProfileEdit = (props: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.userStore);
  const optionalData = useSelector((state: RootState) => state.registStore.optional)
  const [originalImage, setOriginalImage] = useState<string | null>('');
  const [isBtnActive, setIsBtnActive] = useState(false);

  useEffect(() => {
    dispatch(registClear())
    let originalData: OriginalData;
    const getOriginalData = async () => {
      try {
        const response = await userGetProfile()
        
        console.log(response)

        originalData = response.data.data
        setOriginalImage(originalData?.profileImage);

        console.log(originalData)
        dispatch(registOptional({
          userBirthdate: originalData.birthdate,
          userGender: originalData.gender,
          interests: originalData.interests.map(obj => obj.interest),
          introduction: originalData.introduction,
          nickname: originalData.nickname,
          profileImage: originalData.profileImage,
        }))
      } catch (error) {
        console.log(error)
        throw(error)
      }
    }

    getOriginalData()
  }, [])

  const submitUpdate = async () => {
    try {
      if (originalImage === optionalData.profileImage) {
        const response = await userUpdateProfile(optionalData, user.userId, false)
        console.log(response)
      } else {
        const response = await userUpdateProfile(optionalData, user.userId, true)
        console.log(response)
      }
      
      const changeInformation = () => {
        sessionStorage.setItem('nickname', optionalData.nickname);
        if (optionalData.profileImage === null) {
          sessionStorage.setItem('profileImage', '');
        } else {
          sessionStorage.setItem('profileImage', optionalData.profileImage);
        }
        dispatch(
          setUser({
            ...user,
            nickname: optionalData.nickname,
            profileImage: optionalData.profileImage ? optionalData.profileImage : '',
          })
        )
      }
      changeInformation()
      navigate(`/user/${user.userId}`)
    } catch (error) {
      console.log(error)
      throw(error)
    }
  }

  const isOptionalFilled = (optional: RegistOptional): boolean => {
    const { profileImage, introduction, interests, ...rest } = optional;

    const isInterestsValid = interests !== null && interests.length === 6;

    const areOtherFieldsValid = Object.entries(rest).every(([key, value]) => {
      if (key === 'userBirthdate') {
        return value !== undefined && value !== '' && value !== null;
      }
      return typeof value === 'string' && value.trim() !== '';
    });
  
    return isInterestsValid && areOtherFieldsValid;
  };

  useEffect(() => {
    setIsBtnActive(isOptionalFilled(optionalData))
  }, [optionalData])

  return (
    <div
      className={`
        md:w-[44rem] md:mt-[1rem] lg:mt-[3rem] mx-auto p-[1.5rem]
        bg-light-white bg-opacity-80
        dark:bg-dark-white dark:bg-opacity-80
        sm:rounded 
      `}
    >
      <div 
        className={`
          flex items-center md:justify-center mb-[0.75rem] md:mb-[2.5rem] pb-[0.75rem] 
          border-light-black text-light-text
          dark:border-dark-black dark:text-dark-text
          md:text-[2rem] md:border-b-2
        `}
      >
        <LeftArrow 
          className={`md:hidden w-[1.25rem] h-[1.25rem] me-[0.75rem] 
            fill-light-black 
            dark:fill-dark-black
            cursor-pointer
          `}
        />
        <div className={`max-md:text-[1.5rem] hidden sm:block`}>프로필 수정</div>
      </div>
      <UserInformation />

      {/* 비밀번호 변경하기 */}
      <div>
        <Link to='/user/password'>
          <div className={`block mb-[0.5rem] text-light-anchor dark:text-dark-anchor font-md font-medium cursor-pointer`}>비밀번호 변경하기</div>
        </Link>
        <Link to='/user/delete'>
          <div className={`block text-light-anchor dark:text-dark-anchor font-md font-medium cursor-pointer`}>회원탈퇴</div>
        </Link>
      </div>
      
      {/* 완료 버튼 */}
      <div className={`text-center`}>
        <button 
          onClick={submitUpdate}
          className={`
            ${isBtnActive ? 
              'border-light-black hover:bg-light-black hover:text-light-text-white dark:border-dark-black dark:hover:bg-dark-black dark:hover:text-dark-text-white' :
              'border-light-gray bg-light-gray dark:border-dark-gray dark:bg-dark-gray'
            }
            w-[20rem] md:w-[11rem] h-[2.5rem] mt-[2rem]
            border-2 md:rounded-none rounded-md transition-all duration-300 font-bold 
          `}
          disabled={!isBtnActive}
        >
          완료
        </button>
      </div>
    </div>
  )
}

export default ProfileEdit