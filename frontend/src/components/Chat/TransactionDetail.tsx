import React from 'react';
import TransactionMap from './TransactionMap';
import { TransactionEntityType } from './Chat';

type Props = {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  transactionEntity: TransactionEntityType;
}

const ChatTradeModal = (props: Props) => {

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
          <TransactionMap 
            latitude={props.transactionEntity.latitude} 
            longitude={props.transactionEntity.longitude} 
          />
      </div>
    </div>
  )
}

export default ChatTradeModal;