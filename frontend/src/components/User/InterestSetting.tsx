import React, { useState, useEffect } from 'react'

type Props = {
  saveFunction: (params: object) => void;
}

type InterestTag = '일반야영장' | '자동차야영장' | '글램핑' | '카라반' | '숲' | '도심' | '산' | '호수' | 
                   '계곡' | '해변' | '섬' | '주1회이상' | '월1회이상' | '가족' | '반려동물' | '친구' | 
                   '연인' | '혼자' | '수도권' | '강원도' | '경상도' | '충청도' | '전라도' | '제주도';

const InterestSetting = (props: Props) => {
  const interestTagList: string[] = [
    '#일반야영장', '#자동차야영장', '#글램핑', '#카라반', '#숲', '#도심', '#산', '#호수', 
    '#계곡', '#해변', '#섬', '#주1회이상', '#월1회이상', '#가족', '#반려동물', '#친구', 
    '#연인', '#혼자', '#수도권', '#강원도', '#경상도', '#충청도', '#전라도', '#제주도'
  ];

  const [interestChecking, setInterestChecking] = useState<Record<InterestTag, boolean>>({
    '일반야영장': false,
    '자동차야영장': false,
    '글램핑': false,
    '카라반': false,
    '숲': false,
    '도심': false,
    '산': false,
    '호수': false,
    '계곡': false,
    '해변': false,
    '섬': false,
    '주1회이상': false,
    '월1회이상': false,
    '가족': false,
    '반려동물': false,
    '친구': false,
    '연인': false,
    '혼자': false,
    '수도권': false,
    '강원도': false,
    '경상도': false,
    '충청도': false,
    '전라도': false,
    '제주도': false,
  })

  const handleTagClick = (tag: string) => {
    const tagWithoutHash = tag.slice(1) as InterestTag; // Remove '#' from the tag
    setInterestChecking(prev => {
      const newState = {
        ...prev,
        [tagWithoutHash]: !prev[tagWithoutHash]
      };
      return newState;
    });
  };

  useEffect(() => {
    props.saveFunction(interestChecking);
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [interestChecking]);

  return (
    <div className="mb-6">
      <label className="block text-gray-70 text-left font-medium text-lg">관심사 설정</label>
        <p className='text-left font-light mt-1'>원하는 유형의 캠핑태그를 선택해주세요 (중복선택가능)</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {interestTagList.map(tag => (
          <span 
            key={tag} 
            className={`duration-200 px-3 py-1 border-[1.5px] rounded cursor-pointer ${
              interestChecking[tag.slice(1) as InterestTag] 
                ? 'bg-[#ff7f50cb] text-white' 
                : 'hover:bg-[#ff7f50cb] hover:text-white text-gray-700'
            }`}
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </span>
        ))}
        </div>
    </div>
  )
}

export default InterestSetting