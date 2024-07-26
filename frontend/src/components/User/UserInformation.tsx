import React, { useRef, useState, useEffect } from 'react';
import InterestSetting from './InterestSetting';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { registOptional } from '@store/registSlice';

import ProfileImg from '@assets/images/profileimg2.png';
import { ReactComponent as XIcon } from '@assets/icons/close-filled.svg';

const UserInformation = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const registFormData = useSelector((state: RootState) => state.registStore);

  const [uploadedImage, setuploadedImage] = useState<string>(ProfileImg);
  const [nickname, setNickname] = useState<string>(registFormData.nickname);
  const [introduction, setIntroduction] = useState<string>(registFormData.introduction);
  const [nicknameChars, setNicknameChars] = useState<number>(0);
  const [introChars, setIntroChars] = useState<number>(0);
  const [isNicknameAnimating, setIsNicknameAnimating] = useState<boolean>(false);
  const [isIntroductionAnimating, setIsIntroductionAnimating] = useState<boolean>(false);

  useEffect(() => {
    setNicknameChars(nickname.length);
    setIntroChars(introduction.length);
  }, [nickname, introduction]);

  useEffect(() => {
    if (nickname.length === 10) {
      setIsNicknameAnimating(true);
      const timer = setTimeout(() => setIsNicknameAnimating(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [nickname]);

  useEffect(() => {
    if (introduction.length === 50) {
      setIsIntroductionAnimating(true);
      const timer = setTimeout(() => setIsIntroductionAnimating(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [introduction]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setuploadedImage(base64String);
        dispatch(
          registOptional({
            ...registFormData,
            profileImage: base64String,
          })
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInterestsUpload = (interests: object) => {
    dispatch(
      registOptional({
        profileImage: registFormData.profileImage,
        nickname: nickname,
        introduction: introduction,
        interests: interests,
      })
    );
  };

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.length <= 10) {
      setNickname(value);
      dispatch(
        registOptional({
          ...registFormData,
          nickname: value,
        })
      );
    }
  };

  const handleIntroductionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.length <= 50) {
      setIntroduction(value);
      dispatch(
        registOptional({
          ...registFormData,
          introduction: value,
        })
      );
    }
  };

  const clearNickname = () => {
    setNickname('');
    dispatch(
      registOptional({
        ...registFormData,
        nickname: '',
      })
    );
  };

  const clearIntroduction = () => {
    setIntroduction('');
    dispatch(
      registOptional({
        ...registFormData,
        introduction: '',
      })
    );
  };

  const handleImageError = () => {
    setuploadedImage(ProfileImg);
  };

  return (
    <form className="flex justify-center items-center">
      <div className="bg-white p-6 w-full md:max-w-3xl lg:w-[40rem] lg:p-0">

        {/* 프로필사진 */}
        <div className="flex justify-center mb-10">
          <div 
            className="relative size-20 md:size-24 rounded-full mx-auto border-[0.1rem]"
            onClick={() => {fileInputRef.current?.click()}}
          >
            <img src={uploadedImage} onError={handleImageError} alt="프로필 사진" className="absolute size-full rounded-full" />
            <div className='cursor-pointer opacity-0 hover:opacity-100 duration-200 absolute w-full h-full rounded-full mx-auto bg-[#00000098] text-white'>
              <p className='flex justify-center items-center h-full'>사진변경</p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageUpload}
              accept="image/*"
            />
          </div>
        </div>
        {/* 닉네임 */}
        <div className="mb-6 relative">
          <label className="block text-gray-700 text-left font-medium text-lg">닉네임<span className='text-red-500 text-md'> *</span></label>
          <div className="flex items-center border-b border-[#cccccc]">
              <input 
                type="text" 
                className="w-full px-4 py-2 focus:outline-none placeholder-slate-400 focus:ring-0" 
                placeholder='닉네임은 최대 10자 이하여야 합니다.'
                name='nickname'
                value={nickname}
                onChange={handleNicknameChange}
              />
              <span className={`ml-2 ${isNicknameAnimating ? 'text-[#FF7F50] animate-shake' : 'text-gray-500'}`}>
                {nicknameChars}/10
              </span>
              <XIcon className="ml-2 h-5 w-5 text-gray-500 cursor-pointer" onClick={clearNickname} />
            </div>
          
        </div>

        {/* 자기소개 */}
        <div className="mb-6 relative">
          <label className="block text-gray-700 text-left font-medium text-lg">자기소개</label>
          <div className="flex items-center  border-b border-[#cccccc]">
            <input 
              type="text" 
              className="w-full px-4 py-2 focus:outline-none placeholder-slate-400 focus:ring-0" 
              placeholder='자기소개를 입력해주세요.'
              name='introduction'
              value={introduction}
              onChange={handleIntroductionChange}
            />
            <span className={`ml-2 ${isIntroductionAnimating ? 'text-[#FF7F50] animate-shake' : 'text-gray-500'}`}>
              {introChars}/50
            </span>
            <XIcon className="ml-2 h-5 w-5 text-gray-500 cursor-pointer" onClick={clearIntroduction} />
          </div>
        </div>

        {/* 관심사 설정 */}
        <InterestSetting saveFunction={handleInterestsUpload}/>
      </div>
    </form>
  )
}

export default UserInformation;
