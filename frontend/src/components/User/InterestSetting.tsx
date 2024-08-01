import React, { useState, useEffect } from 'react'
import { ReactComponent as PlusIcon } from '@assets/icons/plus.svg'
import { ReactComponent as CheckIcon } from '@assets/icons/check.svg'

type Props = {
  saveFunction: (params: object) => void;
}

// 관심 태그 설정
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
    <div className="flex flex-col items-center mb-[1.5rem]">
      <label
        className={`
          block w-full
          text-light-text
          dark:text-dark-text
          text-left font-medium text-[1.125rem]
        `}
      >
        <p className='text-left'>관심사 설정 
          <span
            className={`
              ms-[0.25rem]
              text-light-heart
              dark:text-dark-heart
            `}
            >
              *
          </span>
        </p>
      </label>

      <div
        className={`
          w-full mt-1 mb-4
          text-light-text
          dark:text-dark-text
          text-left font-light
        `}
      >
        <p>취향에 맞는 컨텐츠를 추천해드립니다!</p>
        <p>원하는 유형의 캠핑태그를 
          <span 
            className={`
              mx-[0.25rem]
              font-medium
            `}
          >
          6개
          </span>
          선택해주세요.
        </p>
      </div>

      <div 
        className={`
          w-full h-fit mt-[0.5rem] p-[0.75rem] 
          bg-slate-50
          dark:bg-dark-white
          shadow-lg rounded-xl
        `}
      >
        <div className='mb-[1rem]'>
          <p 
            className={`
              text-light-text
              dark:text-dark-text
              font-medium text-[1.125rem] 
            `}
          >
            6개 중
            <span 
              className={`
                mx-[0.25rem]
                text-light-signature
                dark:text-dark-signature
                text-[1.5rem]
              `}
            >
              {selectedCount}
            </span>
            개 선택됨
          </p>
          <div
            className={`
              mt-[0.5rem]
              text-light-heart
              dark:text-dark-heart
              text-[0.8758rem]
            ${showWarning ? 'block animate-shake' : 'hidden'}
            `}
          >
            캠핑 태그는 6개만 선택 가능합니다.
          </div>
        </div>

        {Object.entries(interestTagList).map(([category, tags]) => (
          <div className='mb-[1.5rem]' key={category}>
            {/* 카테고리별 주제 */}
            <div
              className={`
                mb-[0.75rem] 
                text-light-text-secondary 
                dark:text-dark-text-secondary 
                font-medium
              `}
            >
              {`# ${category}`}
            </div>

            {/* 카테고리별 태그 */}
            <div className="flex flex-wrap gap-[0.5rem] mt-[0.25rem]">
              {tags.map(tag => (
                <span
                  key={tag}
                  className={`
                    flex items-center ps-[0.75rem] py-[0.25rem] pr-[1rem]
                    duration-200 border-[1.5px] rounded-full cursor-pointer

                    ${interestChecking[tag as InterestTag] ?
                      `border-light-signature text-light-signature
                        dark:border-dark-signature dark:text-dark-signature` :
                      `border-light-border-1 text-light-text-secondary hover:border-light-signature
                      dark:border-dark-border-1 dark:text-dark-text-secondary hover:dark:border-dark-signature`
                    }
                  `}
                  onClick={() => handleTagClick(tag)}
                >
                  {interestChecking[tag as InterestTag] ?
                    <CheckIcon
                      className={`
                        size-[1rem] lg:size-[1.25rem] mr-[0.25rem]
                        fill-light-border-icon
                        dark:fill-dark-border-icon
                      `}
                    /> :
                    <PlusIcon 
                      className={`
                        size-[1rem] lg:size-[1.25rem] mr-[0.25rem]
                        stroke-light-border-icon
                        dark:stroke-dark-border-icon
                      `}
                    />
                  }
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
