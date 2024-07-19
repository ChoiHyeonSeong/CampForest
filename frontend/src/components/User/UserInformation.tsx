import React, { useRef, useState } from 'react'
import InterestSetting from './InterestSetting'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { registOptional } from '@store/registSlice';

import ProfileImg from '@assets/icons/profileimg.png'

const UserInformation = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch()

  const registFormData = useSelector((state: RootState) => state.registStore);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    dispatch(
      registOptional({
        profileImage: registFormData.profileImage,
        nickname: name === 'nickname' ? value : registFormData.nickname,
        introduction: name === 'introduction' ? value : registFormData.introduction,
        interests: registFormData.interests,
      })
    );
    console.log(registFormData)
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setuploadedImage(base64String)
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
        nickname: registFormData.nickname,
        introduction: registFormData.introduction,
        interests: interests,
      })
    );
  };

  const [uploadedImage, setuploadedImage] = useState<string>(ProfileImg)
  const handleImageError = () => {
    setuploadedImage(ProfileImg);
  };

  return (
    <form className="flex justify-center items-center">
      <div className="bg-white p-6 w-full md:max-w-3xl lg:w-[40rem] lg:p-0">

        {/* 프로필사진 */}
        <div className="flex justify-center mb-10">
          <div 
            className="relative w-28 h-28 rounded-full mx-auto border-[0.1rem]"
            onClick={() => {fileInputRef.current?.click()}}
          >
            <img src={uploadedImage} onError={handleImageError} alt="프로필 사진" className="absolute w-24 h-24 rounded-full bottom-0 left-2" />
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
        <div className="mb-6">
          <label className="block text-gray-700 text-left font-medium text-lg">닉네임</label>
          <input 
            type="text" 
            className="w-full px-4 py-2 border-b focus:outline-none border-[#cccccc] placeholder-slate-400 focus:ring-0" 
            placeholder='닉네임을 입력해주세요(최대 8자).'
            name='nickname'
            value={registFormData.nickname}
            onChange={handleChange}
          />
        </div>

        {/* 자기소개 */}
        <div className="mb-6">
          <label className="block text-gray-700 text-left font-medium text-lg">자기소개</label>
          <input 
            type="text" 
            className="w-full px-4 py-2 border-b-[0.1rem] focus:outline-none border-[#cccccc] placeholder-slate-400 focus:ring-0" 
            placeholder='자기소개를 입력해주세요.'
            name='introduction'
            value={registFormData.introduction}
            onChange={handleChange}
          />
        </div>

        {/* 관심사 설정 */}
        <InterestSetting saveFunction={handleInterestsUpload}/>
      </div>
    </form>
  )
}

export default UserInformation