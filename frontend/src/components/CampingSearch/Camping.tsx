import React, {useState} from 'react'

export type CampingDataType = {
  campsiteId: number;
  facltNm?: string;
  lineIntro?: string;
  intro?: string;
  featureNm?: string;
  induty?: string;
  lctCl?: string;
  doNm?: string;
  sigunguNm?: string;
  zipcode?: number;
  addr?: string;
  mapX?: number;
  mapY?: number;
  tel?: string;
  homepage?: string;
  resveUrl?: string;
  caravInnerFclty?: string;
  trlerAcmpnyAt?: string;
  caravAcmpnyAt?: string;
  sbrsCl?: string;
  posblFcltyCl?: string;
  animalCmgCl?: string;
  firstImageUrl?: string;
  createdtime?: string;
  modifiedtime?: string;
  reviewCount?: number;
  averageRate?: number;
}

type Props = {
  camping: CampingDataType
  modalOpen: (param: CampingDataType) => void;
}

const Camping = (props: Props) => {
  const tags = [
    ...(props.camping.lctCl ? props.camping.lctCl.split(',') : []),
    ...(props.camping.sbrsCl ? props.camping.sbrsCl.split(',') : []),
    ...(props.camping.posblFcltyCl ? props.camping.posblFcltyCl.split(',') : []),
  ].map(tag => tag.trim());

  // animalCmgCl에 따라 태그 추가
  if (props.camping.animalCmgCl === '가능') {
    tags.push('애견동반 가능');
  } else if (props.camping.animalCmgCl === '소형견') {
    tags.push('소형견동반 가능');
  } else {
    tags.push('애견동반 불가능');
  }

  return (
    <div 
      onClick={() => props.modalOpen(props.camping)} 
      className={`
        flex items-center w-full 
        border-light-border-1 bg-light-gray
        dark:border-dark-border-1 dark:bg-dark-gray
        border-b mb-[0.5rem]
      `}
    >
      {/* 캠핑이미지 */}
      <div 
        className={`
          hidden md:block md:w-[15rem]
          aspect-[3/2]
          bg-light-gray 
          dark:bg-dark-gray
          rounded-sm overflow-hidden
          m-2
        `}
      >
        {props.camping.firstImageUrl ? (
          <img src={props.camping.firstImageUrl} alt='캠핑장 사진' className='size-full object-cover' />
        ) : (
          <div className='w-full h-full flex items-center justify-center'>
            <span className='text-light-gray-3 dark:text-dark-gray-3'>이미지가 없습니다.</span>
          </div>
        )}
      </div>

      
      <div className={`w-full ms-[0.75rem] my-[0.5rem] py-[0.5rem]`}>
        {/* 캠핑장 이름 및 장소 */}
        <div className={`lex items-baseline mb-[0.5rem]`}>
          <div 
            className={`
              mb-[0.25rem]
              text-xl font-semibold line-clamp-1
            `}
          >
            {props.camping.facltNm}
          </div>
          <div
            className={`
              mb-[0.25rem]
              text-light-text-secondary
              dark:text-dark-text-secondary
              text-xs line-clamp-1
            `}
          >
            {props.camping.addr}
          </div>
        </div>

        {/* 캠핑태그 */}
        <div 
          className={`
            max-md:hidden flex mb-[0.25rem] space-x-[0.5rem]
            text-xs
          `}
        >
          {tags.length <= 3 ? (
            tags.map((tag, index) => (
              <div key={index} className={`px-[0.25rem] py-[0.1rem] bg-light-bgbasic dark:bg-dark-bgbasic dark:text-dark-text-secondary text-sm rounded font-medium`}>
                {tag}
              </div>
            ))
          ) : (
            <>
              {tags.slice(0, 3).map((tag, index) => (
                <div key={index} className={`px-[0.25rem] py-[0.1rem] bg-light-bgbasic dark:bg-dark-bgbasic dark:text-dark-text-secondary text-sm rounded font-medium`}>
                  {tag}
                </div>
              ))}
              <span className='text-sm'>
                외 {tags.length - 3}개의 태그
              </span>
            </>
          )}
        </div>

        {/* 캠핑후기 */}
        <div>
          <div className={`flex items-center mt-[0.5rem] whitespace-nowrap`}>
            <div className={`text-lg me-[0.5rem]`}>
              {props.camping.averageRate ? '★'.repeat(Math.floor(props.camping.averageRate)) : '★★★★★'}
              <span className='ms-[0.25rem]'>{props.camping.averageRate ? Math.round(props.camping.averageRate * 10) / 10 : '기록 없음'}</span>
            </div>
            <div className={`text-xs`}>
              ({props.camping.reviewCount ? props.camping.reviewCount + ' 개의 리뷰' : '기록 없음'})
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Camping;