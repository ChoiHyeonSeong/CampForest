import React from 'react'

type Props = {}

const ChatTradePropser = (props: Props) => {
  return (
    <div
      className='
        flex flex-col min-w-[19rem] p-[0.7rem]
        bg-white border-light-border-2
        dark:border-dark-border-2
        rounded-md border-2
      '
    >
      {/*  */}
      <p
        className='
          mb-[0.75rem]
          font-semibold text-lg
        '
      >
        거래를 제안했습니다.
      </p>

      {/* 상품정보 */}
      <div
        className='
          flex items-center ps-[0.3rem] py-[0.35rem]
          bg-light-reviewcard
          dark:bg-dark-reviewcard
          '>
        {/* 상품사진 */}
        <div
          className='
            shrink-0 size-[4rem] me-[0.75rem]
            bg-white
            overflow-hidden
          '
        >
          <img
            src=''
            alt='상품이미지'
            className='size-full'
          />
        </div>

        {/* 상품상세 */}
        <div
          className='
            w-full
            font-medium
          '
        >
          <div
            className='
              text-light-signature
              dark:text-dark-signature
              text-sm
            '
          >
            대여
          </div>
          <div className='line-clamp-1 break-all'>목스노스 캠핑 스토브</div>
          <div className='font-bold'>18,000원/일</div>
        </div>
      </div>

      {/* 지역일시 */}
      <div className='w-full mt-[0.75rem] mb-[1rem] px-[0.75rem]'>
        <div
          className='
            flex
            font-medium
          '
        >
          <p
            className='
              me-[0.5rem]
              font-semibold
            '
          >
            지역
          </p>
          <p
            className='
              text-light-text-secondary
              dark:text-dark-text-secondary
            '
          >
            구미시 인동동
          </p>
        </div>
        {/* 일시 */}
        <div
          className='
            flex
            font-medium
          '
        >
          <p
            className='
              me-[0.5rem]
              font-semibold
            '
          >
            일시
          </p>
          <p
            className='
              text-light-text-secondary
              dark:text-dark-text-secondary
            '
          >
            2024-07-12 ~ 2024-07-15
          </p>
        </div>
      </div>

      {/* 상세보기 버튼 */}
      <button
        className='
          items-center w-full py-[0.25rem] 
          bg-light-black text-light-white
          dark:bg-dark-black dark:text-dark-white
          rounded
        '
      >
        상세보기
      </button>
    </div>
  )
}

export default ChatTradePropser