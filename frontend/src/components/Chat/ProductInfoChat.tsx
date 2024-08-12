import { setSaleStatus } from '@store/chatSlice';
import { RootState } from '@store/store';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

type Props = {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProductInfoChat = (props: Props) => {
  const product = useSelector((state: RootState) => state.chatStore.product);
  const saleStatus = useSelector((state: RootState) => state.chatStore.saleStatus);

  return (
    <div
      className="
        flex justify-between items-center w-full p-[0.8rem] 
        bg-light-bgbasic border-light-border
        dark:bg-dark-bgbasic dark-border-dark-border
        border-y"
    >
      {/* 상품정보 */}
      <div className="flex items-center">
        {/* 상품이미지 */}
        <div
          className="
            shrink-0 size-[3.5rem] me-[1rem]
            bg-gray-300
            overflow-hidden
          "
        >
          <img src={product?.imageUrls[0]} alt="상품이미지"></img> {/* 이미지 들어갈 곳 */}
        </div>

        {/* 상품상세 */}
        <div>
          {/* 상품 이름 */}
          <div className="text-[1.1rem] font-semibold">{product?.productName}</div>

          {/* 상품 가격 */}
          <div className="flex mt-[0.2rem] text-light-text-secondary dark:text-dark-text-secondary text-[0.97rem] font-medium">
            <div className={`${product?.deposit ? '' : 'hidden'} me-[0.5rem]`}>
              보증금{product?.deposit}원
            </div>
            <div className="">
              {product?.productPrice}원
              <span className={`${product?.deposit ? '' : 'hidden'}`}>/일</span>
            </div>
          </div>
        </div>
      </div>
      {saleStatus === 'RESERVED' ? (
        <div
          className="
          px-[0.7rem] py-[0.4rem]
          bg-light-gray-2
          dark:bg-dark-gray-2
          text-white rounded
        "
        >
          거래확정
        </div>
      ) : saleStatus === 'REQUESTED' ? (
        <div
          className="
          px-[0.7rem] py-[0.4rem]
          bg-light-gray-2
          dark:bg-dark-gray-2
          text-white rounded
        "
        >
          대기 중
        </div>
      ) : saleStatus === 'CONFIRMED' ? (
        <div
          className="
            px-[0.7rem] py-[0.4rem]
            bg-light-signature
            dark:bg-dark-signature
            text-white rounded cursor-pointer
          "
          onClick={() => {

          }}
        >
          후기작성
        </div>
      ) : (
        <div
          className="
        px-[0.7rem] py-[0.4rem]
        bg-light-heart 
        dark:bg-dark-heart
        text-white rounded cursor-pointer
      "
          onClick={() => {
            props.setModalOpen(true);
          }}
        >
          거래요청
        </div>
      )}
    </div>
  );
};

export default ProductInfoChat;
