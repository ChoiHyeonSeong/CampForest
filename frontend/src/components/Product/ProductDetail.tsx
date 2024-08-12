import React, { useEffect, useState } from 'react';
import FireGif from '@assets/images/fire.gif';
import { ReactComponent as LeftArrowIcon } from '@assets/icons/arrow-left.svg';
import { ReactComponent as RightArrowIcon } from '@assets/icons/arrow-right.svg';
import MoreOptionsMenu from '@components/Public/MoreOptionsMenu';
import ProductCard from '@components/Product/ProductCard';
import { productDetail } from '@services/productService';
import { useParams } from 'react-router-dom';
import { priceComma } from '@utils/priceComma';

// swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, store } from '@store/store';
import {
  addMessageToChatInProgress,
  selectTransaction,
  setChatInProgress,
  setChatInProgressType,
  setIsChatOpen,
  setOtherId,
  setRoomId,
  setTotalUnreadCount,
  setTransactionChatUesrList,
  updateMessageReadStatus,
  updateTransactionChatUserList,
} from '@store/chatSlice';
import {
  initTransactionChat,
  transactionChatDetail,
  transactionChatList,
} from '@services/chatService';
import { ChatUserType } from '@components/Chat/ChatUser';
import { useWebSocket } from 'Context/WebSocketContext';

export type ProductDetailType = {
  category: string;
  deposit: number | null;
  hit: number;
  imageUrls: string[];
  interestHit: number;
  location: string;
  productContent: string;
  productId: number;
  productName: string;
  productPrice: number;
  productType: string;
  userId: number;
  nickname: string;
  userImage: string;
};

function Detail() {
  const dispatch = useDispatch();
  const { subscribe, publishMessage } = useWebSocket();
  const loginUserId = Number(sessionStorage.getItem('userId'));
  const productId = Number(useParams().productId);
  const chatState = useSelector((state: RootState) => state.chatStore);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [product, setProduct] = useState<ProductDetailType>({
    category: '',
    deposit: 0,
    hit: 0,
    imageUrls: [],
    interestHit: 0,
    location: '',
    productContent: '',
    productId: 0,
    productName: '',
    productPrice: 0,
    productType: '',
    userId: 0,
    nickname: '',
    userImage: '',
  });

  const [category, setCategory] = useState('');

  useEffect(() => {
    if (product.category === '침낭') {
      setCategory('침낭/매트');
    } else if (product.category === '코펠') {
      setCategory('코펠/식기');
    } else if (product.category === '침낭') {
      setCategory('침낭/매트');
    } else {
      setCategory(product.category);
    }
  }, [product]);

  const fetchProduct = async () => {
    try {
      const result = await productDetail(productId);
      console.log(result);
      setProduct(result);
    } catch (error) {
      console.error('판매 상세 페이지 불러오기 실패: ', error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  async function handleChatButton() {
    console.log(productId);
    const matchedUser = chatState.transactionChatUserList.find(
      (chatUser) => chatUser.productId === productId,
    );
    if (matchedUser) {
      dispatch(setChatInProgressType('거래'));
      dispatch(selectTransaction());
      dispatch(setOtherId(matchedUser.otherUserId));
      dispatch(setRoomId(matchedUser.roomId));
      dispatch(setIsChatOpen(true));
    } else {
      try {
        const roomId = await initTransactionChat(productId, product.userId);
        await fetchTransactionChatList();
        dispatch(setChatInProgressType('거래'));
        dispatch(selectTransaction());
        dispatch(setOtherId(product.userId));
        dispatch(setIsChatOpen(true));
        dispatch(setRoomId(roomId));

        subscribeToChat(roomId);
      } catch (error) {
        console.error('Error in handleChatButton: ', error);
      }
    }
  }

  const fetchTransactionChatList = async () => {
    if (loginUserId) {
      const response = await transactionChatList();
      let count = 0;
      response.map((chatUser: ChatUserType) => {
        count += chatUser.unreadCount;
      });
      store.dispatch(setTotalUnreadCount(count));
      store.dispatch(setTransactionChatUesrList(response));
    }
  };

  function subscribeToChat(roomId: number) {
    // 메세지를 받았을 때
    subscribe(`/sub/transaction/${roomId}`, async (message: { body: string }) => {
      const response = JSON.parse(message.body);
      const state: RootState = store.getState();
      if (response.messageType === 'READ') {
        store.dispatch(
          updateMessageReadStatus({ roomId: response.roomId, readerId: response.senderId }),
        );
      } else if (response.messageType === 'TRANSACTION') {
        console.log(response);
        if (state.chatStore.roomId === response.roomId) {
          store.dispatch(updateTransactionChatUserList({ ...response, inProgress: true }));
          publishMessage(`/pub/transaction/${response.roomId}/read`, state.userStore.userId);
          const fetchedMessages = await transactionChatDetail(response.roomId);
          dispatch(setChatInProgress(fetchedMessages.messages));
        } else {
          store.dispatch(updateTransactionChatUserList({ ...response, inProgress: false }));
        }
      }
      // 현재 열려 있는 채팅방 내용 갱신
      else if (response.messageType === 'MESSAGE') {
        if (state.chatStore.roomId === response.roomId) {
          store.dispatch(updateTransactionChatUserList({ ...response, inProgress: true }));
          publishMessage(`/pub/transaction/${chatState.roomId}/read`, state.userStore.userId);
          store.dispatch(addMessageToChatInProgress(response));
        } else {
          store.dispatch(updateTransactionChatUserList({ ...response, inProgress: false }));
        }
      } else {
        console.log('타입이 없습니다');
      }
    });
  }

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
    <div className={`flex justify-center mb-[5rem] `}>
      <div
        className={`bg-light-gray w-full lg:w-[60rem] xl:w-[66rem] mt-[1.5rem] max-lg:p-6 lg:pt-6`}
      >
        {/* 상단 */}
        <div
          className={`
            flex lg:flex-row flex-col relative w-full mb-[2rem] p-[0.75rem]
            bg-light-gray
            overflow-hidden rounded
          `}
        >
          {/* 이미지 */}
          <Swiper
            className="w-2/5 aspect-1 bg-black"
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
          {/* 내용 */}
          <div className={`w-full lg:w-3/5 md:ps-[1.5rem]`}>
            <div
              className={`
                flex justify-between mt-[1rem] mb-[0.5rem]
                text-sm
              `}
            >
              <div className={`flex`}>
                <div className={`me-[1.5rem]`}>
                  캠핑 장비 {'>'} {category}
                </div>
                <div
                  className={`
                    text-light-signature
                    dark:text-dark-signature
                    font-semibold
                  `}
                >
                  {product.productType === 'SALE' ? '판매' : '대여'}
                </div>
              </div>
              <MoreOptionsMenu
                isUserPost={loginUserId === product.userId}
                deleteId={0}
                deleteFunction={() => {
                  console.log('test');
                }}
              />
            </div>
            <div className={`text-2xl font-medium`}>{product.productName}</div>
            <div
              className={`
                relative mt-[1.5rem]
                border-light-border
                dark:border-dark-border 
                text-sm border-b
              `}
            >
              <div
                className={`
                  w-full min-h-[7rem]
                  break-all
                `}
              >
                {product.productContent}
              </div>
              <div className={`flex my-[1.5rem]`}>
                <div>조회</div>
                <div className={`ms-[0.25rem] me-[0.5rem]`}>{product.hit}</div>
                <div>관심</div>
                <div className={`ms-[0.25rem] me-[0.5rem]`}>{product.interestHit}</div>
              </div>
            </div>
            <div className={`flex justify-between pt-[1.5rem]`}>
              <div>
                <div className={`font-medium`}>픽업 | 반납 장소</div>
                <div
                  className={`
                    p-[0.5rem]
                    text-sm
                  `}
                >
                  <div>{product.location}</div>
                </div>
              </div>
              {/* 가격 */}
              <div className={`mt-[1rem]`}>
                <div
                  className={`
                    flex justify-between mb-[0.5rem]
                    text-lg md:text-xl
                  `}
                >
                  <div
                    className={`
                      me-[1.25rem] 
                      font-semibold
                    `}
                  >
                    가격
                  </div>
                  <div className={`font-bold`}>
                    {priceComma(product.productPrice)} 원
                    <span className={`${product.productType === 'SALE' ? 'hidden' : ''}`}>/일</span>
                  </div>
                </div>
                <div
                  className={`
                    ${product.productType === 'SALE' ? 'hidden' : ''}
                    flex justify-between 
                    text-base md:text-lg
                  `}
                >
                  <div
                    className={`
                      me-[1.25rem]
                      font-semibold
                    `}
                  >
                    보증금
                  </div>
                  <div className={`font-bold`}>{product.deposit} 원</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 판매자 정보 및 거래버튼 */}
        <div
          className={`
            flex flex-col lg:flex-row justify-between mt-[2.5rem] mb-[3.5rem] px-[1rem] py-[1.5rem]
            
            rounded-sm 
          `}
        >
          {/* 판매자 정보 */}
          <div className={`flex flex-col w-full lg:w-[calc(100%-24.5rem)] max-lg:mb-8`}>
            <div className={`w-full mb-[0.75rem]`}>
              <span className={`font-medium`}>{product.nickname}</span>의 제품
            </div>
            <div className={`flex w-full`}>
              <div
                className={`
                  shrink-0 size-[3rem] me-[1rem]
                  bg-light-black
                  dark:bg-dark-black
                  rounded-full
                `}
              >
                <img src={product.userImage} alt={''} />
              </div>
              <div className={`flex flex-col w-full`}>
                <div className={`flex mb-[0.5rem]`}>
                  <div
                    className={`
                      me-[0.75rem]
                      font-medium 
                    `}
                  >
                    거래 불꽃 온도
                  </div>
                  <div
                    className={`
                      text-light-heart
                      dark:text-dark-heart
                      font-medium
                    `}
                  >
                    573°C
                  </div>
                </div>
                <div
                  className={`
                    w-full lg:w-4/5 h-4
                    bg-light-gray
                    dark:bg-dark-gray
                    rounded-full
                  `}
                >
                  <div
                    className={`
                      relative w-1/2 h-full
                      bg-gradient-to-r from-light-warning to-light-signature
                      dark:from-dark-warning dark:to-dark-signature
                      rounded-full
                    `}
                  >
                    <img
                      src={FireGif}
                      alt="불꽃"
                      className={`absolute -right-[4rem] -top-[3.5rem] size-[8rem]`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 거래버튼 */}
          <div className={`flex items-center md:justify-center`}>
            <button
              className={`
                flex flex-all-center w-1/2 md:max-w-[20rem] lg:w-[12rem] h-[2.5rem] me-[0.5rem] py-[0.5rem]
                bg-light-white border-light-signature text-light-signature
                dark:bg-dark-white dark:border-dark-signature dark:text-dark-signature
                rounded-md border font-medium
              `}
            >
              찜하기
            </button>
            <button
              className={`
                flex flex-all-center w-1/2 md:max-w-[20rem] lg:w-[12rem] h-[2.5rem] py-[0.5rem] 
                bg-light-signature text-light-white
                dark:bg-dark-signature
                rounded-md 
              `}
              onClick={handleChatButton}
            >
              채팅하기
            </button>
          </div>
        </div>
        {/* 판매자의 추가거래 상품 받아오기 */}
        <div>
          <div
            className={`
              mb-[0.75rem] 
              text-lg
            `}
          >
            <span className={`font-medium`}>사용자1</span>의 다른 거래 상품 구경하기
          </div>
          <div className={`w-full flex flex-wrap`} />
          {/* <Swiper
            spaceBetween={2}
            slidesPerView={1}
            freeMode={true}
          >
            <SwiperSlide>
              <ProductCard />
            </SwiperSlide>
          </Swiper> */}
        </div>
      </div>
    </div>
  );
}

export default Detail;
