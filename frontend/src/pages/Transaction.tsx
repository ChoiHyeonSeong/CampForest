import Detail from '@components/Transaction/Detail';
import TransactionList from '@components/Transaction/TransactionList';
import React from 'react'
import { Route, Routes } from 'react-router-dom';

const Transaction = () => {
  return (
    <Routes>
      <Route path='/' element={<TransactionList />} />
      <Route path='/detail' element={<Detail />} />
    </Routes>
  )
}

export default Transaction;