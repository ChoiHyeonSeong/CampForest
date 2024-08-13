import React, { useEffect } from 'react';
import { RootState, store } from '@store/store';
import { useDispatch, useSelector } from 'react-redux';
import { TransactionEntityType } from './Chat';
import { useWebSocket } from 'Context/WebSocketContext';
import { setSaleStatus } from '@store/chatSlice';

type Props = {
  setModalType: React.Dispatch<React.SetStateAction<string>>;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTransactionEntity: React.Dispatch<React.SetStateAction<TransactionEntityType | undefined>>;
  transactionEntity: TransactionEntityType | undefined;
};

const ChatTradePropser = ({ setModalType, setModalOpen, setTransactionEntity, transactionEntity }: Props) => {
  const dispatch = useDispatch();
  const product = useSelector((state: RootState) => state.chatStore.product);
  const user = useSelector((state: RootState) => state.userStore);
  const chatState = useSelector((State: RootState) => State.chatStore);
  const { publishMessage } = useWebSocket();

  return (
    <div
      className={`
        flex relative flex-col min-w-[19rem] p-[0.7rem]
        bg-white border-light-border-2
        dark:border-dark-border-2
        rounded-md border-2
      `}
    >
      {transactionEntity?.saleStatus === 'DENIED' && (
      <div className='absolute top-0 left-0 rounded w-full h-full bg-light-black opacity-40 dark:bg-dark-white dark:opacity-40'></div>)
      }
      {/* 상품정보 */}
      <div
        className="
          flex items-center ps-[0.3rem] py-[0.35rem]
          bg-light-reviewcard
          dark:bg-dark-reviewcard
          "
      >
        {/* 상품사진 */}
        <div
          className="
            shrink-0 size-[4rem] me-[0.75rem]
            bg-white
            overflow-hidden
          "
        >
          <img src={product.imageUrls[0]} alt="상품이미지" className="size-full" />
        </div>

        {/* 상품상세 */}
        <div
          className="
            w-full
            font-medium
          "
        >
          <div
            className="
              text-light-signature
              dark:text-dark-signature
              text-sm
            "
          >
            {product.productType === 'RENT' ? '대여' : '판매'}
          </div>
          <div className="line-clamp-1 break-all">{product.productName}</div>
          <div className="font-bold">
            {transactionEntity?.realPrice}원{product.productType === 'RENT' && <span>/일</span>}
          </div>
        </div>
      </div>

      {/* 지역일시 */}
      <div className="w-full mt-[0.75rem] mb-[1rem] px-[0.75rem]">
        <div
          className="
            flex
            font-medium
          "
        >
          <p
            className="
              me-[0.5rem]
              font-semibold
            "
          >
            지역
          </p>
          <p
            className="
              text-light-text-secondary
              dark:text-dark-text-secondary
            "
          >
            {transactionEntity?.meetingPlace}
          </p>
        </div>
        {/* 일시 */}
        <div
          className="
            flex
            font-medium
          "
        >
          <p
            className="
              me-[0.5rem]
              font-semibold
            "
          >
            일시
          </p>
          <p
            className="
              text-light-text-secondary
              dark:text-dark-text-secondary
            "
          >
            {transactionEntity?.meetingTime}
          </p>
        </div>
      </div>

      {/* 수락하기 버튼 */}
      {transactionEntity?.saleStatus === 'DENIED' ? (
        <div className="font-semibold ms-[0.5rem]">
          거절된 거래입니다.
        </div>
      ) : 
      transactionEntity?.saleStatus === 'REQUESTED' &&
        transactionEntity?.requesterId !== user.userId ? (
        <div className="flex gap-[0.5rem]">
          <button
            className="
        items-center w-full py-[0.25rem] 
        bg-light-black text-light-white
        dark:bg-dark-black dark:text-dark-white
        rounded
      "
            onClick={() => {
              console.log(transactionEntity.sellerId)
              console.log(transactionEntity.buyerId)
              publishMessage(`/pub/transaction/${chatState.roomId}/${user.userId}/acceptSale`, {
                productId: product.productId,
                sellerId: transactionEntity.sellerId,
                buyerId: transactionEntity.buyerId,
              });
              dispatch(setSaleStatus('RESERVED'));
            }}
          >
            수락하기
          </button>
          <button
            className="
        items-center w-full py-[0.25rem] 
        bg-light-black text-light-white
        dark:bg-dark-black dark:text-dark-white
        rounded
      "
            onClick={() => {
              console.log(transactionEntity.sellerId)
              console.log(transactionEntity.buyerId)
              publishMessage(`/pub/transaction/${chatState.roomId}/${user.userId}/denySale`, {
                productId: product.productId,
                sellerId: transactionEntity.sellerId,
                buyerId: transactionEntity.buyerId,
              });
              dispatch(setSaleStatus('DENIED'));
            }}
          >
            거절하기
          </button>
        </div>
      ) : (
        <div className='flex gap-[0.5rem]'>
          <button
            className="
              items-center w-full py-[0.25rem] 
              bg-light-black text-light-white
              dark:bg-dark-black dark:text-dark-white
              rounded
            "
            onClick={() => {
              setTransactionEntity(transactionEntity)
              setModalType('detail')
              setModalOpen(true)
            }}
          >
            상세보기
          </button>
          {transactionEntity?.saleStatus === 'RESERVED' ? (
            <button
              className={`
                items-center w-full py-[0.25rem] 
                bg-light-black text-light-white
                dark:bg-dark-black dark:text-dark-white
                rounded 
              `}
              onClick={() => {
                if(user.userId !== transactionEntity.receiverId) {
                publishMessage(`/pub/transaction/${chatState.roomId}/${user.userId}/confirmSale`, {
                  productId: product.productId,
                    sellerId: transactionEntity.sellerId,
                    buyerId: transactionEntity.buyerId,
                  });
                }
              }}
            >
              거래완료
            </button>
        ) : transactionEntity?.saleStatus !== 'REQUESTED' && (<button
          className={`
            items-center w-full py-[0.25rem] 
            bg-light-signature text-light-white
            dark:bg-dark-signature dark:text-dark-white
            rounded cursor-default
          `}
        >
          거래완료
        </button>)}
      </div>)}
    </div>
  );
};

export default ChatTradePropser;
