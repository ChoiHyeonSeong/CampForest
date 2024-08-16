import { checkRentable } from '@services/chatService';
import { setExcludeDates, setIsChatOpen } from '@store/chatSlice';
import { setOpponentInfo, setTransactionInfo } from '@store/reviewSlice';
import { RootState, store } from '@store/store';
import { priceComma } from '@utils/priceComma';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

type Props = {
  opponentNickname: string;
  setModalType: React.Dispatch<React.SetStateAction<string>>;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProductInfoChat = (props: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const product = useSelector((state: RootState) => state.chatStore.product);
  const saleStatus = useSelector((state: RootState) => state.chatStore.saleStatus);
  const reviewState = useSelector((state: RootState) => state.reviewStore);

  async function fetchExcludeDates () {
    const response = await checkRentable(product.productId);
    dispatch(setExcludeDates(response));
  }

  return (
    <div
      className="
        flex justify-between items-center w-full p-[0.5rem] md:p-[0.8rem] 
        bg-light-bgbasic border-light-border
        dark:bg-dark-bgbasic dark-border-dark-border
        border-y"
    >
      {/* 상품정보 */}
      <div className="flex w-4/5 items-center">
        {/* 상품이미지 */}
        <div
          className="
            shrink-0 size-[3.5rem] me-[0.5rem] md:me-[1rem]
            bg-gray-300
            overflow-hidden
          "
        >
          <img src={product?.imageUrls[0]} alt="상품이미지"></img> {/* 이미지 들어갈 곳 */}
        </div>

        {/* 상품상세 */}
        <div>
          {/* 상품 이름 */}
          <div className="max-md:text-sm font-semibold line-clamp-2 break-words">{product?.productName}</div>

          {/* 상품 가격 */}
          <div className="flex mt-[0.2rem] text-light-text-secondary dark:text-dark-text-secondary max-md:text-sm font-medium">
            <div className={`${product?.deposit ? '' : 'hidden'} me-[0.5rem]`}>
              보증금{priceComma(product?.deposit)}원
            </div>
            <div className="">
              {priceComma(product?.productPrice)}원
              <span className={`${product?.deposit ? '' : 'hidden'}`}>/일</span>
            </div>
          </div>
        </div>
      </div>
      <div className='w-1/5 max-md:text-sm truncate'>
      {saleStatus === 'RESERVED' ? (
        <div
          className="
          px-[0.7rem] py-[0.4rem]
          bg-light-gray-2 text-light-text-white
          dark:bg-dark-gray-2 dark:text-dark-text-white
           text-center rounded
        "
        >
          거래확정
        </div>
      ) : saleStatus === 'REQUESTED' ? (
        <div
          className="
          px-[0.7rem] py-[0.4rem]
          bg-light-gray-2 text-light-text-white
          dark:bg-dark-gray-2 dark:text-dark-text-white
           text-center rounded
        "
        >
          대기 중
        </div>
      ) : saleStatus === 'CONFIRMED' ? (
        <div
          className="
            px-[0.7rem] py-[0.4rem]
            bg-light-signature text-light-text-white
            dark:bg-dark-signature dark:text-dark-text-white
            text-center rounded cursor-pointer
          "
          onClick={() => {
            dispatch(setOpponentInfo({...reviewState, opponentNickname: props.opponentNickname}))
            dispatch(setTransactionInfo({
              ...reviewState, productImgUrl: product.imageUrls[0], productName: product.productName, roomId: store.getState().chatStore.roomId
            }))
            dispatch(setIsChatOpen(false));
            sessionStorage.setItem('reviewState', JSON.stringify(store.getState().reviewStore));

            navigate('/review')
          }}
        >
          후기작성
        </div>
      ) : (
        <div
          className="
        px-[0.7rem] py-[0.4rem]
        bg-light-heart text-light-text-white
        dark:bg-dark-heart dark:text-dark-text-white
        text-center rounded cursor-pointer
      "
          onClick={() => {
            fetchExcludeDates();
            props.setModalType('request');
            props.setModalOpen(true);
          }}
        >
          거래요청
        </div>
      )}
      </div>
    </div>
  );
};

export default ProductInfoChat;
