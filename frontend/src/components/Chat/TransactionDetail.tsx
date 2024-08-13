import React from 'react';
import TransactionMap from './TransactionMap';
import { TransactionEntityType } from './Chat';
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg' 
import { RootState } from '@store/store';
import { useSelector } from 'react-redux';

type Props = {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  transactionEntity: TransactionEntityType;
}

const ChatTradeModal = (props: Props) => {
  const product = useSelector((state: RootState) => state.chatStore.product);
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
          <div 
            onClick={() => {props.setModalOpen(false)}}
            className='fixed top-[0.75rem] right-[0.75rem] z-[50] cursor-pointer'
          >
            {product.latitude}
            <CloseIcon />
          </div>
          <TransactionMap 
            latitude={product.latitude} 
            longitude={product.longitude} 
          />
      </div>
    </div>
  )
}

export default ChatTradeModal;