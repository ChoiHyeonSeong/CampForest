import React, { useState } from 'react'
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg'
import { ReactComponent as StarIcon } from '@assets/icons/star.svg'
import MultiImageUpload from '@components/Public/MultiImageUpload'

type Props = {
}
const WriteReview = (props: Props) => {

  const [productImages, setProductImages] = useState<File[]>([]);
  const [rating, setRating] = useState<number>(0);


  const handleImagesChange = (images: File[]) => {
    setProductImages(images);
  };
  const handleStarClick = (index: number) => {
    setRating(index);
  };
  

  return (
    <div 
      className={`
        fixed z-[100] w-full h-full
        bg-light-black bg-opacity-80
        dark:bg-dark-black dark:bg-opacity-80
        inset-0
      `}
      // onClick={() => dispatch(setIsBoardWriteModal(false))} 
    >
      <div 
        className={`md:w-[40rem] h-full md:h-[90%] md:mx-auto`} 
        onClick={(event) => event.stopPropagation()}
      >
        <div 
          className={`
            flex flex-col justify-between md:w-[35rem] h-[calc(100vh-5.95rem)] md:h-[85%] mt-[3.2rem] md:mt-[15%] md:mx-auto p-[1rem] md:px-[2rem] md:py-[2rem]
            bg-light-white
            dark:bg-dark-white
            overflow-auto md:rounded-md 
          `}
        >
          {/* 모달 상단 */}
          <div className={`flex justify-between items-center h-[2rem]`}>
            {/* 모달 제목 */}
            <div
              className={`
                text-light-text
                dark:text-dark-text
                text-xl font-medium  
              `}
            >
              거래 평가하기
            </div>

            {/* 닫기버튼 - 모바일에선 없음 */}
            <CloseIcon
              className={`
                hidden md:block size-[1.5rem]
                fill-light-text-secondary  
                dark:fill-dark-text-secondary
                cursor-pointer  
              `}
            />
          </div>

          {/* 리뷰작성칸 */}
          <div
            className={`
             flex flex-col items- w-full h-calc(100%-4.5rem) py-[1rem]
            `}
          >
            {/* 거래상품 */}
            <div
              className={`
                flex items-center w-full p-[0.75rem]
                bg-light-gray-1
                dark:bg-dark-gray-1
                rounded-sm
              `}
            >
              <div
                className={`
                  size-[5rem] me-[0.75rem]
                  bg-light-white
                  rounded overflow-hidden
                `}
              >
                <img
                  src=''
                  alt='상품이미지'
                  className={`
                    size-full   
                  `}
                ></img>
              </div>

              <div>
                {/* 상품가격 */}
                <div
                  className={`
                    mb-[0.15rem]
                    text-light-text
                    dark:text-dark-text
                    font-medium
                  `}
                >20,000원</div>
                {/* 상품이름 */}
                <div
                  className={`
                    text-light-text-secondary
                    dark:text-dark-text-secondary
                    font-medium
                  `}
                >
                상품이름이야</div>
              </div>

            </div>
            
            {/* 별점남기기 */}
            <div
              className={`
                flex flex-col items-center w-full my-[1.5rem]
              `}
            >
              <div
                className={`
                  mb-[0.5rem]
                  text-light-text 
                  dark:text-dark-text
                `}
              >
                <span
                  className={`
                    font-medium  
                  `}
                >
                  사용자1
                </span>
              님과 거래가 어떠셨나요?
              </div>
              <div
                className={`
                  flex justify-center gap-[0.7rem]
                `}
              >
                {[1, 2, 3, 4, 5].map((index) => (
                  <StarIcon
                    key={index}
                    className={`
                      size-[1.6rem] md:size-[1.9rem] cursor-pointer
                      ${rating >= index ?
                        'stroke-light-star fill-light-star' : 'stroke-light-border-1 dark:stroke-dark-border-1'
                      } 
                      transition-transform transform hover:scale-110
                    `}
                    onClick={() => handleStarClick(index)}
                  />
                ))}
              </div>
            </div>

            {/* 후기 작성칸 */}
            <div className='flex-grow'>
            <textarea 
                className={`
                  w-full h-[11rem] p-[0.5rem]
                  bg-light-white border-light-border-1
                  dark:bg-dark-white dark:border-dark-border-1
                  resize-none focus:outline-none border rounded break-all
                `}
                placeholder='자세한 후기를 남겨주시면 다른 사용자들에게 도움이 됩니다.'
              />

            </div>
            
            {/* 상품사진 추가 */}
            <div>
              <MultiImageUpload onImagesChange={handleImagesChange} />
            </div>
          </div>

          {/* 작성하기 */}
          <div
            className={`
              flex flex-all-center w-full h-[2.5rem] shrink-0
              bg-light-signature text-light-text-white hover:bg-light-signature-hover
              dark:bg-dark-signature hover:dark:bg-dark-signature-hover
              rounded text-center cursor-pointer
            `}
          >
            <div>
            작성하기
            </div>
          </div>
          
        </div>

      </div>
    </div>
  )
}

export default WriteReview;
