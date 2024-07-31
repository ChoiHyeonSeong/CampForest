import React, { useState, useEffect } from 'react'
import { ReactComponent as PlusIcon } from '@assets/icons/plus.svg'
import { ReactComponent as CheckIcon } from '@assets/icons/check.svg'

type Props = {
  saveFunction: (params: object) => void;
}

type InterestTag = '선호 캠핑 분위기' | '산' | '해변' | '숲' | '도심' | '근교' | '계곡' | '섬' |
                   '선호 캠핑 지역' | '수도권' | '강원도' | '충청도' | '전라도' | '경상도' | '제주도' |
                   '선호 캠핑 동반자' | '가족' | '연인' | '혼자' | '친구' | '반려동물' |
                   '선호 캠핑 종류' | '오토캠핑' | '백패킹' | '모토캠핑' | '미니멀캠핑' | '차박캠핑' | '글램핑' | '카라반' | '노지캠핑' | '캠프닉' | '비박' |
                   '선호 캠핑 컨셉' | '요리' | '자연' | '사진' | '술' | '휴식' | '별' | '불멍' | '수상 스포츠' | '암벽 등반' | '음악';

const interestTagList: Record<string, string[]> = {
  '선호 캠핑 분위기': ['산', '해변', '숲', '도심', '근교', '계곡', '섬'],
  '선호 캠핑 지역': ['수도권', '강원도', '충청도', '전라도', '경상도', '제주도'],
  '선호 캠핑 동반자': ['가족', '연인', '혼자', '친구', '반려동물'],
  '선호 캠핑 종류': ['오토캠핑', '백패킹', '모토캠핑', '미니멀캠핑', '차박캠핑', '글램핑', '카라반', '노지캠핑', '캠프닉', '비박'],
  '선호 캠핑 컨셉': ['요리', '자연', '사진', '술', '휴식', '별', '불멍', '수상 스포츠', '암벽 등반', '음악']
};

const InterestSetting = (props: Props) => {
  const initialTagsState = Object.values(interestTagList).flat().reduce((acc, tag) => {
    acc[tag as InterestTag] = false;
    return acc;
  }, {} as Record<InterestTag, boolean>);

  const [interestChecking, setInterestChecking] = useState(initialTagsState);
  const [selectedCount, setSelectedCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  const handleTagClick = (tag: string) => {
    if (selectedCount >= 6 && !interestChecking[tag as InterestTag]) {
      setShowWarning(true);
      return;
    }

    setInterestChecking(prev => {
      const newState = {
        ...prev,
        [tag as InterestTag]: !prev[tag as InterestTag]
      };
      return newState;
    });
  };

  useEffect(() => {
    const count = Object.values(interestChecking).filter(Boolean).length;
    setSelectedCount(count);
    props.saveFunction(interestChecking);
    if (count <= 6) {
      setShowWarning(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interestChecking]);

  useEffect(() => {
    if (showWarning) {
      const timer = setTimeout(() => {
        setShowWarning(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showWarning]);

  return (
    <div className="mb-6 flex flex-col items-center">
      <label className="w-full block text-gray-70 text-left font-medium text-lg">
        <p className='text-left'>관심사 설정<span className='text-red-500 text-md'> *</span></p>
      </label>
      <div className='w-full text-left font-light mt-1 mb-4'>
        <p className=''>취향에 맞는 컨텐츠를 추천해드립니다!</p>
        <p>원하는 유형의 캠핑태그를 <span className='font-medium'>6개</span> 선택해주세요.</p>
      </div>

      <div className='w-full h-fit py-3 px-3 shadow-lg mt-2 rounded-xl bg-slate-50'>
        <div className='mb-4'>
          <p className='font-medium text-lg'>6개 중 <span className='text-[#ff7f50] text-2xl'>{selectedCount}</span> 개 선택됨</p>
          <div className={`text-sm text-red-500 mt-2 ${showWarning ? 'block animate-shake' : 'hidden'}`}>캠핑 태그는 6개만 선택 가능합니다.</div>
        </div>

        {Object.entries(interestTagList).map(([category, tags]) => (
          <div className='interesting-cate mb-6' key={category}>
            <div className='font-medium text-gray-500 mb-3'>{`# ${category}`}</div>
            <div className="flex flex-wrap gap-2 mt-1">
              {tags.map(tag => (
                <span
                  key={tag}
                  className={`duration-200 ps-3 py-1 border-[1.5px] rounded-full flex items-center cursor-pointer pr-4 ${
                    interestChecking[tag as InterestTag] 
                      ? 'border-[#ff7f50] text-[#ff7f50]'
                      : 'border-gray-300 text-gray-600 hover:border-[#ff7f50]'
                  }`}
                  onClick={() => handleTagClick(tag)}
                >
                  {interestChecking[tag as InterestTag] ? <CheckIcon className='mr-1 size-4 lg:size-5' /> : <PlusIcon className='mr-1 size-4 lg:size-5 ' />}
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default InterestSetting;
