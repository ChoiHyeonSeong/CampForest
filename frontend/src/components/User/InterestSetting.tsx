import React from 'react'

const InterestSetting = () => {
  // 관심태그
  const interestTagList: string[] = [
    '#일반야영장', '#자동차야영장', '#글램핑', '#카라반', '#숲', '#도심', '#산', '#호수', 
    '#계곡', '#해변', '#섬', '#주1회이상', '#월1회이상', '#가족', '#반려동물', '#친구', 
    '#연인', '#혼자', '#수도권', '#강원도', '#경상도', '#충청도', '#전라도', '#제주도'
  ];

  return (
    <div className="mb-6">
      <label className="block text-gray-70 text-left font-medium text-lg">관심사 설정</label>
        <p className='text-left font-light mt-1'>원하는 유형의 캠핑태그를 선택해주세요 (중복선택가능)</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {interestTagList.map(tag => (
          <span key={tag} className="duration-200 hover:bg-[#ff7f50cb] hover:text-white px-3 py-1 border-[1.5px] text-gray-700 rounded cursor-pointer">{tag}</span>
        ))}
        </div>
    </div>
  )
}

export default InterestSetting