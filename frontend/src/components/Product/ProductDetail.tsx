import React, { useEffect, useState } from 'react';
import FireGif from '@assets/images/fire.gif';
import { ReactComponent as LeftArrowIcon } from '@assets/icons/arrow-left.svg';
import { ReactComponent as RightArrowIcon } from '@assets/icons/arrow-right.svg';
import MoreOptionsMenu from '@components/Public/MoreOptionsMenu';
import ProductCard from '@components/Product/ProductCard';
import { productDetail, productList, productLike, productDislike, productDelete } from '@services/productService';
import { useParams, useNavigate } from 'react-router-dom';
import { priceComma } from '@utils/priceComma';
import defaultImage from '@assets/images/basic_profile.png';
import { ProductType } from '@components/Product/ProductCard';

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
  setSaleStatus,
  setTransactionUnreadCount,
  setTransactionChatUserList,
  updateTransactionChatUserList,
} from '@store/chatSlice';
import {
  initTransactionChat,
  transactionChatDetail,
  transactionChatList,
} from '@services/chatService';
import { ChatUserType } from '@components/Chat/ChatUser';
import { useWebSocket } from 'Context/WebSocketContext';

import { setIsLoading } from '@store/modalSlice';
import { setOpponentInfo, setTransactionInfo } from '@store/reviewSlice';
import Swal from 'sweetalert2';

type ImageType = {
  createdAt: string;
  imageUrl: string;
  modefiedAt: string;
  userImageId: number;
};

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
  saved: boolean;
  userId: number;
  nickname: string;
  userImage: ImageType | null;
  latitude: number;
  longitude: number;
  temperature?: number;
};

function Detail() {
  const navigate = useNavigate();
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
    userImage: null,
    saved: false,
    latitude: 0,
    longitude: 0,
    temperature: 500,
  });

  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([])

  const [category, setCategory] = useState('');

  const [resetTrigger, setResetTrigger] = useState(false)

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

  const popLoginAlert = () => {
    Swal.fire({
      icon: "error",
      title: "로그인 해주세요.",
      text: "로그인 후 사용가능합니다.",
      confirmButtonText: '확인'
    }).then(result => {
      if (result.isConfirmed) {
        navigate('/user/login')
      }
    });
  }

  const fetchProduct = async () => {
    try {
      dispatch(setIsLoading(true))
      const result = await productDetail(productId);
      console.log(result);

      const relatedResult = await productList({
        productType: '',
        size: 5,
        userId: result.userId
      });
      
      const isProductIdInRelated = relatedResult.products.some(
        (product: ProductType) => product.productId === result.productId
      );
      
      if (isProductIdInRelated) {
        const filteredProducts = relatedResult.products.filter(
          (product: ProductType) => product.productId !== result.productId
        );  

        const additionalResult = await productList({
          productType: '',
          size: 1,
          userId: result.userId,
          cursorId: relatedResult.nextCursorId
        });
  
        setRelatedProducts([...filteredProducts, ...additionalResult.products])
      } else {
        setRelatedProducts(relatedResult.products)
      } 
      setProduct(result);
      dispatch(setIsLoading(false))
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
        subscribeToChat(roomId);

        dispatch(setChatInProgressType('거래'));
        dispatch(selectTransaction());
        dispatch(setOtherId(product.userId));
        dispatch(setIsChatOpen(true));
        dispatch(setRoomId(roomId));
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
      store.dispatch(setTransactionUnreadCount(count));
      store.dispatch(setTransactionChatUserList(response));
    }
  };

  const subscribeToChat = (roomId: number) => {
    // 메세지를 받았을 때
    subscribe(`/sub/transaction/${roomId}`, async (data) => {
      const response = JSON.parse(data.body);
      console.log('Received chat message: ', response);
      const state: RootState = store.getState();

      if (response.message && response.message.messageType === 'TRANSACTION') {
        if (state.chatStore.roomId === response.message.roomId) {
          dispatch(updateTransactionChatUserList({ ...response.message, inProgress: true }));
          
          const fetchedMessages = await transactionChatDetail(response.message.roomId);
          store.dispatch(setChatInProgress(fetchedMessages.messages));
          let lastSaleState = '';
          let confirmedCount = 0;
          for (const message of fetchedMessages.messages) {
            if (message.transactionEntity) {
              if (message.transactionEntity.saleStatus) {
                if (message.transactionEntity.saleStatus === 'CONFIRMED') {
                  ++confirmedCount;
                  if (confirmedCount === 2) {
                    lastSaleState = message.transactionEntity.saleStatus;
                    dispatch(setOpponentInfo({opponentId: state.chatStore.otherId, opponentNickname: state.reviewStore.opponentNickname}))
                    dispatch(setTransactionInfo({
                      ...state.reviewStore,
                      productType: 'SALE',
                      price: message.transactionEntity.realPrice,
                      deposit: 0
                    }))
                  }
                } else if (message.transactionEntity.saleStatus !== '') {
                  lastSaleState = message.transactionEntity.saleStatus;
                }
              } else {
                if (message.transactionEntity.rentStatus === 'CONFIRMED') {
                  ++confirmedCount;
                  if (confirmedCount === 2) {
                    lastSaleState = message.transactionEntity.rentStatus;
                    dispatch(setOpponentInfo({opponentId: state.chatStore.otherId, opponentNickname: state.reviewStore.opponentNickname}))
                    dispatch(setTransactionInfo({
                      ...state.reviewStore,
                      productType: 'RENT',
                      price: message.transactionEntity.realPrice,
                      deposit: message.transactionEntity.deposit
                    }))
                  }
                } else {
                  lastSaleState = message.transactionEntity.rentStatus;
                }
              }
            }
          }
    
          console.log('lastSaleState', lastSaleState);
          dispatch(setSaleStatus(lastSaleState));
          publishMessage(`/pub/transaction/${response.message.roomId}/read`, state.userStore.userId);
        } else {
          dispatch(updateTransactionChatUserList({ ...response.message, inProgress: false }));
        }
      }
      else if (response.messageType === 'READ') {
          dispatch(setChatInProgress([...store.getState().chatStore.chatInProgress.map((message: any) => 
            message.message ? (
              message.message.roomId === response.roomId && message.message.senderId !== response.senderId
              ? { transactionEntity: message.transactionEntity, message: {...message.message, read: true } }
              : message
            ) : (
              message.roomId === response.roomId && message.senderId !== response.senderId
              ? { ...message, read: true }
              : message
            )
          )]))
        } 
      // 현재 열려 있는 채팅방 내용 갱신
      else if (response.messageType === 'MESSAGE') {
        if (state.chatStore.roomId === response.roomId) {
          dispatch(updateTransactionChatUserList({ ...response, inProgress: true }));
          publishMessage(`/pub/transaction/${state.chatStore.roomId}/read`, state.userStore.userId);
          dispatch(addMessageToChatInProgress(response));
        } else {
          dispatch(updateTransactionChatUserList({ ...response, inProgress: false }));
        }
      } else {
        console.log('타입이 없습니다');
      }
    });
  }

  // 찜
  const toggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      if (product.saved) {
        const response = await productDislike(product.productId)
        console.log(response)
        setProduct(prev => ({
          ...prev,
          saved: false,
        }))

        console.log(relatedProducts)
        setRelatedProducts(prevProducts =>
          prevProducts.map(eachProduct =>
            eachProduct.productId === product.productId
              ? { ...eachProduct, saved: false }
              : eachProduct
          )
        );

      } else {
        const response = await productLike(product.productId)
        console.log(response)
        setProduct(prev => ({
          ...prev,
          saved: true,
        }))

        setRelatedProducts(prevProducts =>
          prevProducts.map(eachProduct =>
            eachProduct.productId === product.productId
              ? { ...eachProduct, saved: true }
              : eachProduct
          )
        );
      }
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    setRelatedProducts([])
    setResetTrigger(true)
  }, [productId])

  useEffect(() => {
    if (resetTrigger) {
      fetchProduct()
      setResetTrigger(false)
    }
  }, [resetTrigger])

  // 삭제 함수
  const deleteFunction = async () => {
    try {
      const result = await productDelete(product.productId)
      console.log(result)
      navigate('/product/list/all')
    } catch (error) {
      console.log(error)
    };
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

  const updateFunction = () => {
    navigate('modify')
  };

  let percentage: number = 50;
  if (product.temperature) {
    percentage = Math.min(Math.max(Math.round((product.temperature / 1400) * 100), 0), 100);
  };

  return (
    <div className={`flex justify-center mb-[5rem] `}>
      <div
        className={`
          w-full lg:w-[60rem] xl:w-[66rem] mt-[1.5rem] max-lg:p-6 lg:pt-6
          bg-light-gray
          dark:bg-dark-gray
        `}
      >
        {/* 상단 */}
        <div
          className={`
            flex lg:flex-row flex-col relative w-full mb-[2rem] p-[0.75rem]
            bg-light-gray
            dark:bg-dark-gray
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
                deleteFunction={deleteFunction}
                updateFunction={updateFunction}
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
                  w-full min-h-[7rem] max-h-[10rem]
                  break-all whitespace-pre-wrap overflow-y-auto
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
                  <div className={`font-bold`}>{priceComma(product.deposit)} 원</div>
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
              <span onClick={() => navigate(`/user/${product.userId}`)} className={`font-medium cursor-pointer`}>{product.nickname}</span> 님의 제품
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
                <img 
                  onClick={() => navigate(`/user/${product.userId}`)}
                  src={product.userImage !== null ? product.userImage.imageUrl : defaultImage} 
                  alt={''} 
                  className={`
                    rounded-full w-full h-full cursor-pointer
                  `}
                />
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
                    {product.temperature}℃
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
                    style={{ 
                      width: `${percentage}%` 
                    }}
                  >
                    <img 
                      src={FireGif} 
                      alt="불꽃" 
                      className={`absolute -right-[4rem] -top-[4.5rem] z-[0] w-[128px] min-w-[128px] h-[160px] min-h-[160px] no-drag`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 거래버튼 */}
          <div className={`flex items-center md:justify-center`}>
            <button
              onClick={toggleLike}
              className={`
                ${
                  product.saved ? 
                  'bg-light-signature border-light-signature text-light-white dark:bg-dark-signature dark:border-dark-signature dark:text-dark-white' :
                  'bg-light-white border-light-signature text-light-signature dark:bg-dark-white dark:border-dark-signature dark:text-dark-signature'
                }
                flex flex-all-center w-1/2 md:max-w-[20rem] lg:w-[12rem] h-[2.5rem] me-[0.5rem] py-[0.5rem]
                rounded-md border font-medium
              `}
            >
              {product.saved ? '찜취소' : '찜하기'}
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
        <div className='mx-[1rem]'>
          <div
            className={`
              mb-[0.75rem] 
              text-lg
            `}
          >
            <span className={`font-medium`}>{product.nickname}</span>의 다른 거래 상품 구경하기
          </div>
          <div className={`w-full flex flex-wrap`}>
            {/* <ProductCard /> */}
            {relatedProducts.map((product) => (
              <div
                key={product.productId}
                className='w-[20%]'
              >
                <ProductCard 
                  product={product}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
