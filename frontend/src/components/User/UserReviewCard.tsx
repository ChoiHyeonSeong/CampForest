import React, { useEffect, useState } from 'react'

// swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { ReactComponent as StarIcon } from '@assets/icons/star.svg'
import { ReactComponent as LeftArrowIcon } from '@assets/icons/arrow-left.svg';
import { ReactComponent as RightArrowIcon } from '@assets/icons/arrow-right.svg';
import { ReviewType } from '@components/Chat/Chat'

type Props = {
  review: ReviewType;
}

const UserReviewCard = (props: Props) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Swiper 크기 제어용
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div 
      className={`
        flex mb-[0.75rem] py-[1.25rem] px-[1rem] md:px-[2rem]
        bg-light-reviewcard
        dark:bg-dark-reviewcard
        rounded 
      `}
    >
      <div>
        {/* 평점 */}
        <div className={`flex items-center mb-[0.5rem]`}>
          <StarIcon
            className={`
              size-[1.25rem] me-[0.5rem]
              fill-light-star
              dark:fill-dark-star  
            `}
          />
          <div className={`font-medium text-lg`}>
            {props.review.rating.toFixed(1)}
          </div>
        </div>
        {/* 후기 텍스트 */}
        <div 
          className={`
            w-full 
            text-justify text-base break-all    
          `}
        >
          {props.review.reviewContent}
        </div>
      </div>
      <div className='ms-auto w-1/4 md:w-1/6'>
        {/* 이미지 */}
        <Swiper
            className="w-full aspect-1 bg-light-white dark:bg-dark-white"
            style={{ maxWidth: `${windowWidth}px` }} // 브라우저 크기만큼 maxWidth 설정
            modules={[Navigation, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            navigation={{ nextEl: '.my-next-button', prevEl: '.my-prev-button' }}
            pagination={{ clickable: true }}
            onSwiper={(swiper: any) => console.log(swiper)}
          >
            {props.review.reviewImages.map((imageUrl: any, index) => (
              <SwiperSlide key={index}>
                <img
                  src={imageUrl.imageUrl}
                  alt="ProductImg"
                  className="
                        w-full h-full 
                        object-contain
                      "
                />
              </SwiperSlide>
            ))}
            <button
              className={`
                    my-next-button 
                    absolute top-1/2 right-[0.5rem] z-[10] p-[0.5rem]
                    transform -translate-y-1/2 rounded-full
                    bg-white bg-opacity-50
                  `}
            >
              <RightArrowIcon className="w-[1.5rem] h-[1.5rem]" />
            </button>
            <button
              className={`
                    my-prev-button
                    absolute top-1/2 left-2 z-10 p-2
                    transform -translate-y-1/2 rounded-full
                    bg-white bg-opacity-50
                  `}
            >
              <LeftArrowIcon className="w-[1.5rem] h-[1.5rem]" />
            </button>
            <style
              dangerouslySetInnerHTML={{
                __html: `
                    .swiper-container {
                      width: 100% !important;
                      height: 100% !important;
                    }
                    .swiper-slide {
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    }
                    .swiper-pagination-bullet {
                      background-color: #888 !important;
                      opacity: 0.5 !important;
                    }
                    .swiper-pagination-bullet-active {
                      background-color: #555 !important;
                      opacity: 1 !important;
                    }
                  `,
              }}
            />
          </Swiper>
      </div>
    </div>
  )
}

export default UserReviewCard