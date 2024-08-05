import React, { useRef, useState, useEffect } from 'react';
import InterestSetting from './InterestSetting';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { registOptional } from '@store/registSlice';

import ProfileImg from '@assets/images/profileimg2.png';
import { ReactComponent as XIcon } from '@assets/icons/close-filled.svg';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const UserInformation = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const registFormData = useSelector((state: RootState) => state.registStore);

  const [uploadedImage, setuploadedImage] = useState<string>(ProfileImg);

  const birthdate = registFormData.optional.userBirthdate ? new Date(registFormData.optional.userBirthdate) : null;
  
  const handleDateChange = (date: Date | null) => {
    dispatch(
      registOptional({
        ...registFormData.optional, 
        userBirthdate: date?.toISOString() || null,
      }),
    );
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setuploadedImage(base64String);
        dispatch(
          registOptional({
            ...registFormData.optional,
            profileImage: base64String,
          })
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    dispatch(
      registOptional({
        profileImage: registFormData.optional.profileImage,
        nickname: name === 'nickname' ? value : registFormData.optional.nickname,
        userBirthdate: name === 'userBirthdate' ? value : registFormData.optional.userBirthdate,
        userGender: name === 'userGender' ? value : registFormData.optional.userGender,
        introduction: name === 'introduction' ? value : registFormData.optional.introduction,
        interests: registFormData.optional.interests,
      }),
    );
  };

  const handleInterestsUpload = (interests: string[]) => {
    dispatch(
      registOptional({
        ...registFormData.optional,
        interests: interests,
      })
    );
  };

  const clearNickname = () => {
    dispatch(
      registOptional({
        ...registFormData.optional,
        nickname: '',
      })
    );
  };

  const clearIntroduction = () => {
    dispatch(
      registOptional({
        ...registFormData.optional,
        introduction: '',
      })
    );
  };

  // 이미지 이상한거 올라가면 Default 이미지로 변경
  const handleImageError = () => {
    setuploadedImage(ProfileImg);

    dispatch(
      registOptional({
        ...registFormData.optional,
        profileImage: null,
      })
    );
  };

  return (
    <form className={`flex justify-center items-center`}>
      <div className={`w-full md:max-w-3xl lg:w-[40rem] max-lg:p-[1.5rem]`}>
        {/* 프로필사진 */}
        <div className={`flex justify-center mb-[2.5rem]`}>
          <div 
            className={`
              relative size-[5rem] md:size-[6rem]
              border-light-border
              dark:border-dark-border 
              rounded-full mx-auto border-[0.1rem]
            `}
            onClick={() => {fileInputRef.current?.click()}}
          >
            <img 
              src={uploadedImage}
              onError={handleImageError} 
              alt="프로필 사진" 
              className={`
                absolute size-full 
                rounded-full
              `}
            />
            <div 
              className={`
                absolute w-full h-full mx-auto
                bg-light-black text-light-white
                dark:bg-dark-black dark:text-dark-white
                cursor-pointer opacity-60 hover:opacity-100 duration-200 rounded-full
              `}
            >
              <p className={`flex justify-center items-center h-full`}>
                사진변경
              </p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              className={`hidden`}
              onChange={handleImageUpload}
              accept="image/*"
            />
          </div>
        </div>
        {/* 닉네임 */}
        <div className={`relative mb-[1.5rem]`}>
          <label 
            className={`
              block
              text-left font-medium text-lg
            `}
          >
            닉네임
            <span 
              className={`
                text-light-warning
                dark:text-dark-warning
                text-md
              `}
            > 
              *
            </span>
          </label>
          <div 
            className={`
              flex items-center 
              border-light-border-1
              dark:border-dark-border-1
              border-b
            `}
          >
            <input 
              type="text" 
              className={`
                w-full px-[1rem] py-[0.5rem]
                bg-light-white placeholder-light-text-secondary
                dark:bg-dark-white dark:placeholder-dark-text-secondary
                focus:outline-none focus:ring-0
              `}
              maxLength={10}
              placeholder='닉네임은 최대 10자 이하여야 합니다.'
              name='nickname'
              value={registFormData.optional.nickname}
              onChange={handleChange}
            />
            <span className={`me-[0.5rem]`}>
              {registFormData.optional.nickname.length}/10
            </span>
            <XIcon 
              className={`
                size-[1.25rem] me-[0.5rem]
                text-light-text-secondary
                dark:text-dark-text-secondary
                 ursor-pointer
              `}
              onClick={clearNickname} 
            />
          </div>
        </div>
        {/* 생년월일 성별 */}
        <div 
          className={`
            my-[3rem] lg:my-[1.5rem]
            border-light-border
            dark:border-dark-border
            md:border-b
          `}
        >
          <div 
            className={`
              mb-[0.25rem]
              font-medium 
            `}
          >
            생년월일
          </div>
          <div className={`flex md:flex-row flex-col`}>
            <DatePicker
              placeholderText="날짜를 선택해주세요."
              className={`
                w-full px-[1rem] py-[0.75rem]
                bg-light-white border-light-border
                dark:bg-dark-white dark:border-dark-border
                border-b md:border-none focus:outline-none
              `}
              dateFormat="yyyy.MM.dd"
              formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 1)}
              showYearDropdown
              showMonthDropdown
              scrollableYearDropdown
              shouldCloseOnSelect
              yearDropdownItemNumber={100}
              minDate={new Date('1900-01-01')}
              maxDate={new Date()}
              selected={birthdate}
              onChange={handleDateChange}
            />
            <div className={`md:hidden mt-[3rem] mb-[1rem]`}>
              성별
            </div>
            <div className={`flex items-center space-x-[2rem] md:ms-auto me-[1rem]`}>
              <div className={`flex items-center`}>
                <input
                  className={`
                    size-[1rem] mx-[0.75rem]
                    accent-light-black
                    dark:accent-dark-black
                  `}
                  type="radio"
                  name="userGender"
                  value="M"
                  checked={registFormData.optional.userGender === 'M'}
                  onChange={handleChange}
                />
                <span>
                  남자
                </span>
              </div>
              <div className={`flex items-center`}>
                <input
                  className={`size-[1rem] mx-[0.75rem]
                    accent-light-black
                    dark:accent-dark-black
                  `}
                  type="radio"
                  name="userGender"
                  value="F"
                  checked={registFormData.optional.userGender === 'F'}
                  onChange={handleChange}
                />
                <span>
                  여자
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 자기소개 */}
        <div className={`relative mb-[1.5rem]`}>
          <label 
            className={`
              block 
              text-left font-medium text-lg
            `}
          >
            자기소개
          </label>
          <div 
            className={`
              flex items-center 
              border-light-border-1
                dark:border-dark-border-1
              border-b
            `}
          >
            <input 
              type="text" 
              className={`
                w-full px-[1rem] py-[0.5rem]
                bg-light-white placeholder-light-text-secondary
                dark:bg-dark-white dark:placeholder-dark-text-secondary 
                focus:outline-none focus:ring-0
              `}
              maxLength={50}
              placeholder='자기소개를 입력해주세요.'
              name='introduction'
              value={registFormData.optional.introduction}
              onChange={handleChange}
            />
            <span className={`me-[0.5rem]`}>
              {registFormData.optional.introduction.length}/50
            </span>
            <XIcon 
              className={`
                size-[1.25rem] me-[0.5rem]  
                text-light-text-secondary
                dark:text-dark-text-secondary cursor-pointer
              `}
              onClick={clearIntroduction} />
          </div>
        </div>

        {/* 관심사 설정 */}
        <InterestSetting saveFunction={handleInterestsUpload}/>
      </div>
    </form>
  )
}

export default UserInformation;
