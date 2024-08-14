import React, { useEffect, useState } from 'react';
import TransactionMap from './TransactionMap';
import { ReactComponent as LeftArrowIcon } from '@assets/icons/arrow-left.svg';
import { ReactComponent as RightArrowIcon } from '@assets/icons/arrow-right.svg';
import { TransactionEntityType } from './Chat';
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg' 
import { RootState } from '@store/store';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

// swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type Props = {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  transactionEntity: TransactionEntityType;
}

const ChatTradeModal = (props: Props) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const product = useSelector((state: RootState) => state.chatStore.product);
  const isChatOpen = useSelector((state: RootState) => state.chatStore.isChatOpen)
  const chatInProgressType = useSelector((state: RootState) => state.chatStore.chatInProgressType)
  const roomId = useSelector((state: RootState) => state.chatStore.roomId)
  const [initialRoomId, setInitialRoomId] = useState<number | null>(null);

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

  useEffect(() => {
    if(!isChatOpen) {
      props.setModalOpen(false);
    }
  }, [isChatOpen])

  useEffect(() => {
    if(chatInProgressType === '일반'){
    props.setModalOpen(false);
    }
  }, [chatInProgressType])

  useEffect(() => {
  if (props.modalOpen) {
    setInitialRoomId(roomId);
  }
}, [props.modalOpen]);

  useEffect(() => {
    if (initialRoomId && roomId !== initialRoomId) {
      props.setModalOpen(false);
    }
  }, [roomId]);

  return (
    <div
      className='
        absolute z-[20] w-full h-full
        bg-light-black bg-opacity-80
        dark:bg-dark-gray dark:bg-opacity-80
      '
    >
      <div
        className='
          relative left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 md:w-[90%] md:h-[90%] pt-[1.5rem] px-[1.5rem]
          bg-light-white
          dark:bg-dark-white
          rounded-lg overflow-scroll
        '
      >
        <div 
          onClick={() => {props.setModalOpen(false)}}
          className='flex justify-between'
        >
          <div className='text-xl font-semibold'>거래 정보</div>
          <div className='cursor-pointer'><CloseIcon /></div>
        </div>
        <div className='mt-[1rem] px-[15%] bg-light-gray dark:bg-dark-gray'>
          {/* 이미지 */}
          <Swiper
              className="w-full aspect-1 bg-black"
              style={{ maxWidth: `${windowWidth}px` }} // 브라우저 크기만큼 maxWidth 설정
              modules={[Navigation, Pagination]}
              spaceBetween={0}
              slidesPerView={1}
              navigation={{ nextEl: '.my-next-button', prevEl: '.my-prev-button' }}
              pagination={{ clickable: true }}
              onSwiper={(swiper: any) => console.log(swiper)}
            >
              {product.imageUrls.map((imageUrl, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={imageUrl}
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
        <div className='mt-[2rem]'>
          <div className='text-2xl font-semibold mb-[0.5rem]'>
            {product.productName}
          </div>
          {product.productType === 'SALE' ? (<div className='grid grid-cols-3'>
            <div className='col-span-2 space-y-[0.25rem]'>
              <div className='flex'>
                <div className='w-[4rem] me-[0.5rem] font-semibold'>금액</div>
                {props.transactionEntity.realPrice}원
              </div>
              <div className='flex'>
                <div className='w-[4rem] me-[0.5rem] font-semibold'>거래 시간</div>
                {props.transactionEntity.meetingTime && format(props.transactionEntity.meetingTime, 'MM월 dd일 a hh:mm', {locale: ko})}
              </div>
            </div>
            <div>
              <div className='flex'>
                <div className='me-[0.5rem] font-semibold'>판매자</div>
                {product.nickname}
              </div>
            </div>
          </div>) : (
            <div>
            <div className='grid grid-cols-5'>
              <div className='col-span-3 space-y-[0.25rem]'>
                <div className='flex'>
                  <div className='w-[4rem] me-[0.5rem] font-semibold'>금액</div>
                  {props.transactionEntity.realPrice}원/일
                </div>
                <div className='flex'>
                  <div className='w-[4rem] me-[0.5rem] font-semibold'>시작 시간</div>
                  {props.transactionEntity.rentStartDate && format(props.transactionEntity.rentStartDate, 'MM월 dd일 a hh:mm', {locale: ko})}
                </div>
                <div className='flex'>
                  <div className='w-[4rem] me-[0.5rem] font-semibold'>반납 시간</div>
                  {props.transactionEntity.rentEndDate && format(props.transactionEntity.rentEndDate, 'MM월 dd일 a hh:mm', {locale: ko})}
                </div>
              </div>
              <div className='col-span-2 space-y-[0.25rem]'>
                <div className='flex'>
                  <div className='me-[0.5rem] font-semibold'>
                    보증금
                  </div>
                  {props.transactionEntity.deposit}원
                </div>
                <div className='flex'>
                  <div className='me-[0.5rem] font-semibold'>
                    판매자
                  </div>
                  {product.nickname}
                </div>
              </div>
            </div>
            </div>)
          }
          
          <div className='mt-[2rem] mb-[0.5rem] text-xl font-semibold'>
            거래 장소
          </div>
        </div>
        <TransactionMap 
          latitude={product.latitude} 
          longitude={product.longitude} 
          address={props.transactionEntity.meetingPlace}
        />
      </div>
    </div>
  )
}

export default ChatTradeModal;