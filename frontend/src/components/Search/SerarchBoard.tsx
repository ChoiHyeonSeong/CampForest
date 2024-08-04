import React from 'react'

type Props = {}

const SerarchBoard = (props: Props) => {
  return (
    <div className='flex justify-between items-center w-full px-[1rem] py-[1.5rem] border-light-border-1 dark:border-dark-border-1 border-b'>
      {/* 게시물 내용 */}
      <div>
        {/* 게시물 제목 */}
        <p
          className='
            text-light-text
            dark:text-dark-text
            font-bold text-lg break-all line-clamp-1'>캠핑은 장비빨 아닌가요?</p>

        {/* 게시물 내용 */}
        <div
          className='
            w-full my-[0.5rem]
            text-light-text-secondary
            dark:text-dark-text-secondary
            line-clamp-2 break-all
          '
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum ex aliquid laboriosam numquam, blanditiis eos odio molestiae voluptas dolor, expedita optio ad quisquam ut quos doloribus aspernatur molestias id porro!
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloribus ab sapiente cum sequi in iusto possimus, unde architecto maxime voluptatum, quam accusantium quo dolorem ex delectus molestias asperiores eum eaque!
        </div>

        {/* 게시물 정보 */}
        <div className='flex items-center'>
          <div className='font-bold'>닉네임</div>
          <div
            className='
              mx-[0.5rem]
              text-light-text-secondary
              dark:text-dark-text-secondary
              text-[0.9rem]
            '
          >
            좋아요
            <span className='ms-[0.15rem]'>25</span>
          </div>
          <div
            className='
              text-light-text-secondary
              dark:text-dark-text-secondary
              text-[0.9rem]
            '
          >
            조회수
            <span className='ms-[0.15rem]'>25</span>
          </div>
        </div>
      </div>

      {/* 게시물 사진 -> 없으면 사이즈 0*/} 
      <div
        className='
          shrink-0 size-[5.5rem] ms-[1.5rem]
          bg-gray-200
          overflow-hidden rounded-sm'>
        <img src='' alt='게시물 사진'></img>
      </div>
    </div>
  )
}

export default SerarchBoard