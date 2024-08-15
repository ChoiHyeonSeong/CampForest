import React from 'react'
import RecommandUser from './RecommandUser';
import { SimilarUserType } from '@store/userSlice';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const Recommand = () => {
  const similarUsers = JSON.parse(sessionStorage.getItem('similarUsers')!)
  return (
    <div>
      {similarUsers && (<div 
        className={`
          mt-[1rem] p-[1rem]
          border-light-border bg-light-white bg-opacity-60
          dark:border-dark-border dark:bg-dark-white dark:bg-opacity-60
          border rounded-md
        `}
      >
        {/* 사용자 추천 */}
        <div 
          className={`
            border-light-border
            dark:border-dark-border
          `}
        >
          <div className={`ms-[0.5rem] mb-[0.5rem] font-semibold`}>
            사용자 추천
          </div>
          <Swiper
            spaceBetween={8}
            breakpoints={{
              0: {
                slidesPerView: 3,
              },
              768: {
                slidesPerView: 4,
              },
            }}
            className="mySwiper"
          >
            {similarUsers.map((similarUser: SimilarUserType, index: number) => (
              <SwiperSlide key={index}>
                <RecommandUser userInfo={similarUser} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>)}
    </div>
  )
}

export default Recommand;