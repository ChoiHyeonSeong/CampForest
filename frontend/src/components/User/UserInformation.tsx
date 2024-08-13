import React, { useRef, useState, useEffect } from 'react';
import InterestSetting from './InterestSetting';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { registOptional } from '@store/registSlice';

import ProfileImg from '@assets/images/basic_profile.png';
import { ReactComponent as XIcon } from '@assets/icons/close-filled.svg';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const UserInformation = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const registFormData = useSelector((state: RootState) => state.registStore);

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
    dispatch(
      registOptional({
        ...registFormData.optional,
        profileImage: null,
      })
    );
  };

  return (
    <form className={`flex justify-center items-center`}>
      <div className={`w-full md:w-[40rem]`}>
        {/* 프로필사진 */}
        <div className={`flex justify-center `}>
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
              src={registFormData.optional.profileImage === null ? ProfileImg : registFormData.optional.profileImage}
              onError={handleImageError} 
              alt="프로필 사진" 
              className={`
                absolute size-full 
                rounded-full overflow-hidden
              `}
            />
            <div 
              className={`
                absolute w-full h-full mx-auto
                bg-black text-white
                cursor-pointer opacity-0 hover:opacity-80 duration-200 rounded-full
              `}
            >
              <p className={`flex justify-center items-center h-full`}>
                변경
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
        <div className={`relative  my-[1.5rem]`}>
          <label 
            className={`
              block
              text-left font-medium text-lg
            `}
          >
            닉네임
            <span 
              className={`
                ms-[0.25rem]
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
                w-full p-[0.75rem]
                bg-transparent placeholder:text-light-gray-2
                placeholder:dark:text-dark-gray-2
                focus:outline-none
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
                 cursor-pointer
              `}
              onClick={clearNickname} 
            />
          </div>
        </div>
        {/* 생년월일 성별 */}
        <div 
          className={`
            my-[1.5rem]
            border-light-border-1
            dark:border-dark-border-1
            border-b
          `}
        >
          <div 
            className={`
              block
              text-left font-medium text-lg
            `}
          >
            생년월일<span className='max-md:hidden'> / 성별</span>

            <span 
              className={`
                ms-[0.25rem]
                text-light-warning
                dark:text-dark-warning
                text-md
              `}
            > 
              *
            </span>
          </div>
          <div className={`flex md:flex-row flex-col`}>
            <DatePicker
              placeholderText="날짜를 선택해주세요."
              className={`
                w-full p-[0.75rem]
                bg-transparent placeholder:text-light-gray-2 max-md:border-light-border-1
                placeholder:dark:text-dark-gray-2 max-md:dark:border-dark-border-1
                focus:outline-none max-md:border-b
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
            <div 
              className={`
                md:hidden block my-[1.5rem]
                text-left font-medium text-lg
              `}
            >
              성별
              <span 
                className={`
                  ms-[0.25rem]
                  text-light-warning
                  dark:text-dark-warning
                  text-md
                `}
              > 
                *
              </span>
            </div>
            <div className={`flex items-center space-x-[1rem] md:ms-auto me-[0.5rem] mb-[0.75rem] md:mb-0`}>
              <div className={`flex items-center`}>
                <input
                  className={`
                    size-[1rem] mx-[0.5rem]
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
                  className={`size-[1rem] mx-[0.5rem]
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
                w-full  p-[0.75rem]
                bg-transparent placeholder:text-light-gray-2
                placeholder:dark:text-dark-gray-2
                focus:outline-none
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
        <InterestSetting/>
      </div>
    </form>
  )
}

export default UserInformation;
