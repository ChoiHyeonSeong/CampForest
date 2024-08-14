import { ProductDetailType } from '@components/Product/ProductDetail';
import ProductMap from '@components/Product/ProductMap';
import React, { FormEvent, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ReactComponent as LocationIcon } from '@assets/icons/location.svg';
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg';
import { useWebSocket } from 'Context/WebSocketContext';
import { useSelector } from 'react-redux';
import { RootState, store } from '@store/store';

type Props = {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export type LocationType = {
  address: string;
  latitude: number;
  longitude: number
}

const ChatTradeModal = (props: Props) => {
  const chatState = useSelector((state: RootState) => state.chatStore);
  const [price, setPrice] = useState<number>(chatState.product.productPrice);
  const [deposit, setDeposit] = useState<number | null>(chatState.product.deposit);
  const [location, setLocation] = useState<LocationType>({
    address: chatState.product.location,
    latitude: chatState.product.latitude,
    longitude: chatState.product.longitude,
  });
  const [firstDate, setFirstDate] = useState<Date>(new Date());
  const [secondDate, setSecondDate] = useState<Date>(new Date());
  const [secondMaxDate, setSecondMaxDate] = useState<Date>(new Date('2100-01-01'));
  const [loadMap, setLoadMap] = useState(false);
  const { publishMessage } = useWebSocket();
  const userState = useSelector((state: RootState) => state.userStore);

  const handleFirstDateChange = (date: Date | null) => {
    if (date) {
      setFirstDate(date);
      
      // 다음 사용 가능한 날짜를 찾아 secondMaxDate로 설정
      const nextAvailableDate = store.getState().chatStore.excludeDates
        .map(d => new Date(d))
        .sort((a, b) => a.getTime() - b.getTime())
        .find(d => d.getTime() > date.getTime());
  
      if (nextAvailableDate) {
        setSecondMaxDate(new Date(nextAvailableDate.getTime() - 24 * 60 * 60 * 1000)); // 1일 전으로 설정
      } else {
        setSecondMaxDate(new Date('2100-01-01')); // 기본값으로 설정
      }
  
      // secondDate 조정
      if (secondDate.getTime() <= date.getTime()) {
        setSecondDate(date);
      } else if (nextAvailableDate && secondDate.getTime() >= nextAvailableDate.getTime()) {
        setSecondDate(new Date(nextAvailableDate.getTime() - 24 * 60 * 60 * 1000));
      }
    }
  };

  const handleSecondDateChange = (date: Date | null) => {
    if(date) {
      setSecondDate(date);
    }
  }

  const openMap = (value: boolean) => {
    setLoadMap(value);
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (chatState.product.productType === 'SALE') {
      publishMessage(`/pub/transaction/${chatState.roomId}/${userState.userId}/saleRequest`, {
        productId: chatState.product.productId,
        sellerId: chatState.product.userId,
        buyerId: chatState.product.userId === userState.userId ? chatState.otherId : userState.userId,
        meetingTime: firstDate,
        meetingPlace: location.address,
        price: price,
        latitude: location.latitude,
        longitude: location.longitude,
      })
    } else {
      publishMessage(`/pub/transaction/${chatState.roomId}/${userState.userId}/rentRequest`, {
        productId: chatState.product.productId,
        renterId: chatState.product.userId === userState.userId ? chatState.otherId : userState.userId,
        ownerId: chatState.product.userId,
        rentStartDate: firstDate,
        rentEndDate: secondDate,
        meetingPlace: location.address,
        realPrice: price,
        deposit: deposit,
        latitude: location.latitude,
        longitude: location.longitude,
      })
    }

    props.setModalOpen(false);
  }

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
          relative left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 md:w-[90%] md:h-[90%] p-[1.5rem]
          bg-light-white
          dark:bg-dark-white
          rounded-lg
        '>
          <div className='flex justify-between mb-[1rem] text-2xl'>
            <div>
              거래 요청
            </div>
            <div>
              <CloseIcon 
                className='
                  fill-light-black
                  dark:fill-dark-black
                  cursor-pointer
                ' 
                onClick={() => props.setModalOpen(false)}
              />
            </div>
          </div>
          {/* 상품 정보 */}
          <div 
            className='
              flex mb-[1rem] py-[1rem]
              border-light-border
              dark:border-dark-border
              border-y
            '
          >
            <div className='w-1/4'>
              <img 
                className='w-full aspect-1'
                src={chatState.product.imageUrls[0]} 
                alt='' />
            </div>
            <div className='relative w-3/4 px-[1rem]'>
              <div>
                <div className='text-xl'>
                  {chatState.product.productName}
                </div>
                <div 
                  className='
                    text-light-signature
                    dark:text-dark-signature
                    text-base
                  '
                >
                  {chatState.product.productType === 'RENT' ? '대여' : '판매'}
                </div>
              </div>
              <div 
                className='
                  flex absolute bottom-0 left-[1rem]
                  text-lg
                '
              >
                <div className='flex items-center'>
                  <span className='text-base me-[0.5rem]'>금액</span>
                  <span className='font-semibold'>
                    {chatState.product.productType === 'RENT' ? `${chatState.product.productPrice}원` : `${chatState.product.productPrice}원/일`}
                  </span>
                </div>
                {chatState.product.productType ==='RENT' ? (
                  <div className='flex items-center'>
                    <span 
                      className='
                        mx-[0.5rem]
                        text-sm
                      '
                    >
                      |
                    </span>
                    <span className='text-base me-[0.5rem]'>
                      보증금
                    </span>
                    <span className='font-semibold'>
                      {chatState.product.deposit}원
                    </span>
                  </div>
                ) : (<></>)}
              </div>
            </div>
          </div>
          {/* 입력 폼 */}
          <form 
            className='p-[0.5rem]'
            onSubmit={handleSubmit}
          >
            <div className='mb-[1.5rem]'>
              <div className='font-semibold text-lg'>
                {chatState.product.productType === 'SALE' ? '거래 ' : '대여 '}
                희망 시간
              </div>
              <div className='flex w-full'>
                <DatePicker
                  placeholderText="날짜와 시간을 선택해주세요."
                  className='
                        w-full mt-[0.5rem] p-[0.5rem]
                        border-light-border-2 focus:outline-light-signature
                        dark:border-dark-border-2 dark:focus:outline-dark-signature
                        border rounded-lg
                      '
                  dateFormat='yyyy.MM.dd HH:mm' // 날짜와 시간 포맷 변경
                  formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 1)}
                  showYearDropdown
                  showMonthDropdown
                  showTimeSelect // 시간 선택 활성화
                  timeFormat="HH:mm" // 24시간 형식
                  timeIntervals={15} // 15분 간격으로 시간 선택
                  timeCaption="시간" // 시간 선택 레이블
                  scrollableYearDropdown
                  shouldCloseOnSelect
                  yearDropdownItemNumber={3}
                  minDate={new Date()}
                  maxDate={new Date('2100-01-01')}
                  selected={firstDate}
                  excludeDates={store.getState().chatStore.excludeDates.map((date) => new Date(date))}
                  onChange={handleFirstDateChange}
                />
              </div>
            </div>
            <div>
              {chatState.product.productType === 'RENT' && (
                <div>
                  <span className='font-semibold text-lg'>반납 희망 시간</span>
                  <div>
                    <DatePicker
                      placeholderText="날짜와 시간을 선택해주세요."
                      className='
                        w-full mt-[0.5rem] p-[0.5rem]
                        border-light-border-2 focus:outline-light-signature
                        dark:border-dark-border-2 dark:focus:outline-dark-signature
                        border rounded-lg
                      '
                      dateFormat='yyyy.MM.dd HH:mm' // 날짜와 시간 포맷 변경
                      formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 1)}
                      showYearDropdown
                      showMonthDropdown
                      showTimeSelect // 시간 선택 활성화
                      timeFormat="HH:mm" // 24시간 형식
                      timeIntervals={15} // 15분 간격으로 시간 선택
                      timeCaption="시간" // 시간 선택 레이블
                      scrollableYearDropdown
                      shouldCloseOnSelect
                      yearDropdownItemNumber={3}
                      minDate={firstDate}
                      maxDate={secondMaxDate}
                      selected={secondDate}
                      excludeDates={store.getState().chatStore.excludeDates.map((date) => new Date(date))}
                      onChange={handleSecondDateChange}
                    />
                </div>
              </div>)}
            </div>
            <div className='flex w-full mt-[1.5rem]'>
              <div className='w-1/2 pr-2'>
                <div className='font-semibold text-lg'>
                  금액 
                  <span className='ms-[0.5rem] text-sm'>(원{chatState.product.productType === 'RENT' && <span>/일</span>})</span>
                </div>
                <div className='flex items-baseline'>
                  <input
                    className='
                    w-full mt-[0.5rem] p-[0.5rem]
                    border-light-border-2 focus:outline-light-signature
                    dark:border-dark-border-2 dark:focus:outline-dark-signature
                    border rounded-lg
                  '
                    type='number'
                    value={price}
                    onChange={(event) => {
                      setPrice(Number(event.target.value));
                    }}
                  />
                </div>
              </div>
              {deposit !== null && (
                <div className='w-1/2 ps-[0.5rem]'>
                  <div className='font-semibold text-lg'>
                    보증금 
                    <span className='ms-[0.5rem] text-sm'>(원)</span>
                  </div>
                  <div className='flex items-baseline'>
                    <input
                      className='
                      w-full mt-[0.5rem] p-[0.5rem]
                      border-light-border-2 focus:outline-light-signature
                      dark:border-dark-border-2 dark:focus:outline-dark-signature
                      border rounded-lg
                    '
                      type='number'
                      value={deposit}
                      onChange={(event) => {
                        setDeposit(Number(event.target.value));
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div>
              <div className='mt-[1.5rem] font-semibold text-lg'>
                거래 희망 장소
              </div>
              <div 
                onClick={() => openMap(true)} 
                className={`
                  flex w-full mt-[0.5rem] p-[0.5rem]
                  border-light-border-2
                  dark:border-dark-border-2
                  border rounded-lg
                `}
              >
                <LocationIcon
                  className={`
                    size-[1.25rem] me-[0.5rem]
                    fill-light-border-icon
                    dark:fill-dark-border-icon
                  `}
                />
                <div className={`
                    ${location.address === '장소를 선택하세요.' ? 'text-light-text-secondary dark:text-dark-text-secondary' : 'text-light-text-secondary dark:text-dark-text-secondary'} 
                    cursor-pointer
                  `}
                >
                  {location.address}
                </div>
              </div>
            </div>
            <button 
              type='submit' 
              className={`
                absolute md:w-[calc(90%-1rem)] bottom-[2rem] p-[0.5rem]
                bg-light-black text-light-white hover:bg-light-signature
                dark:bg-dark-black dark:text-dark-white hover:dark:bg-dark-signature
                transition-all duration-150 rounded-lg
              `}
            >
              요청하기
            </button>
          </form>
          {loadMap && 
        <div 
          className={`
            fixed top-1/2 left-1/2
            -translate-y-1/2 -translate-x-1/2
          `}
        >
      <ProductMap 
        situation={'chatTradeModal'}
        isPersonal={true}
        setLocation={setLocation}
        openMap={openMap} />
      </div>}
      </div>
    </div>
  )
}

export default ChatTradeModal;